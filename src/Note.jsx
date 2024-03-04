import { useEffect, useRef, useState } from "react";
import styles from "./Note.module.scss";
import { marked } from "marked";
import Editor from "@monaco-editor/react"

function Note({ id, ogTitle = "Untitled", ogContent = "Write something!", onSaveCB, onDeleteCB, onReorderCB}) {
    const [title, setTitle] = useState(ogTitle);
    const [content, setContent] = useState(ogContent);
    const [isEditingTitle, setEditingTitle] = useState(false);
    const [isEditingContent, setEditingContent] = useState(false);

    const isEditing = isEditingContent || isEditingTitle;

    const noteRef = useRef(null);
    const contentRef = useRef(null);
    const inputRef = useRef(null);
    const editorRef = useRef(null);

    function getEditorValue() {
        if (isEditingContent) return editorRef.current.getValue();
        else return content;
    }
    
    function getTitleValue() {
        if (isEditingTitle) return inputRef.current.value;
        else return title;
    }

    function onSubmitTitle() {
        if (isEditingTitle) {
            setTitle(getTitleValue())};
        setEditingTitle(false);
    }

    function onSubmitContent() {
        if (isEditingContent) setContent(getEditorValue());
        setEditingContent(false);
    }

    function onSubmit() {
        onSubmitTitle();
        onSubmitContent();
        if (isEditing) {
            const isDiff = title !== getTitleValue() || content !== getEditorValue();
            if (isDiff) {
                onSaveCB(id, getTitleValue(), getEditorValue());
            }
        }
    }

    function onEditorMounted(editor, monaco) {
        editorRef.current = editor;
        editor.focus();
    }

    useEffect(() => {
        if (inputRef.current !== null && isEditingTitle) {
            inputRef.current.focus();
        }
        function onClickOutside(event) {
            if (isEditingTitle && inputRef.current !== null && !inputRef.current.contains(event.target)) {
                onSubmit();
            }
            if (isEditingContent && contentRef.current !== null && !contentRef.current.contains(event.target)) {
                onSubmit();
            }
        }

        document.addEventListener("mousedown", onClickOutside);
        return () => {
            document.removeEventListener("mousedown", onClickOutside);
        };
    }, [isEditingTitle, isEditingContent]);

    function Title() {
        function onKeyDown(e) {
            if (e.key !== "Enter") return;
            onSubmitTitle();
        }

        if (isEditingTitle) {
            return (
                <>
                    <input
                        ref={inputRef}
                        type="text"
                        onKeyDown={onKeyDown}
                        defaultValue={title}
                    />
                </>
            );
        } else {
            return (
                <>
                    <h1>{title}</h1>
                </>
            );
        }
    }

    function Content() {
        if (isEditingContent) {
            return (
                <>
                <Editor height="100%" width="100%" defaultLanguage="markdown" value={content} theme="vs-dark" onMount={onEditorMounted}/>
                </>
            );
        } else {
            return (
                <div className="no-defaults" dangerouslySetInnerHTML={{ __html: marked(content) }}></div>
            )
        }
    }

    return (
        <div data-id={id}      
        ref={noteRef} 
        className={["noteShape" + " " + styles.note]}>
            <div
                className={styles.noteTitle}
                onClick={() => setEditingTitle(true)}
            >
                <Title />
            </div>
            <div
                ref={contentRef}
                className={styles.noteContent}
                onClick={() => setEditingContent(true)}
            >
                <Content />
                <div className={styles.remove} onClick={() => onDeleteCB(id)}></div>
            </div>
        </div>
    );
}

export default Note;
