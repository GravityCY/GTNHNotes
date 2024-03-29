import * as Marked from "marked";
import * as MonacoReact from "@monaco-editor/react";

import * as NoteContainer from "./NoteContainer";
import React from "react";
import * as Monaco from "monaco-editor";

import styles from "./Note.module.scss";
import { DEBUG } from "../utils";

function Note({
    id,
    ogTitle = "Untitled",
    ogContent = "Write something!",
    container,
}: {
    id: string;
    ogTitle: string;
    ogContent: string;
    container: NoteContainer.Props;
}) {
    const [title, setTitle] = React.useState(ogTitle);
    const [content, setContent] = React.useState(ogContent);
    const [isEditingTitle, setEditingTitle] = React.useState(false);
    const [isEditingContent, setEditingContent] = React.useState(false);
    const [mouseXY, setMouseXY] = React.useState({ x: 0, y: 0 });
    const [isPickup, setPickup] = React.useState(false);

    const cmouseXYRef = React.useRef({ x: 0, y: 0 });
    const smouseYRef = React.useRef(0);

    const isMouseDownRef = React.useRef(false);

    const noteRef: React.MutableRefObject<HTMLDivElement | null> =
        React.useRef(null);

    // Display
    const titleRef: React.MutableRefObject<HTMLDivElement | null> =
        React.useRef(null);
    const contentRef: React.MutableRefObject<HTMLDivElement | null> =
        React.useRef(null);

    // Editing
    const inputRef: React.MutableRefObject<HTMLInputElement | null> =
        React.useRef(null);
    const editorRef: React.MutableRefObject<Monaco.editor.IStandaloneCodeEditor | null> =
        React.useRef(null);

    function getEditorValue() {
        return editorRef.current === null || !isEditingContent
            ? content
            : editorRef.current?.getValue();
    }

    function getTitleValue() {
        return inputRef.current === null || !isEditingTitle
            ? title
            : inputRef.current?.value;
    }

    function onSubmitTitle() {
        if (isEditingTitle) {
            setTitle(getTitleValue());
        }
        setEditingTitle(false);
    }

    function onSubmitContent() {
        if (isEditingContent) setContent(getEditorValue());
        setEditingContent(false);
    }

    function onSubmit() {
        onSubmitTitle();
        onSubmitContent();
        if (isEditingTitle || isEditingContent) {
            const isDiff =
                title !== getTitleValue() || content !== getEditorValue();
            if (isDiff) {
                container.saveNote(id, getTitleValue(), getEditorValue());
            }
        }
    }

    function onEditorMounted(editor, monaco) {
        editorRef.current = editor;
        editor.focus();
    }

    React.useEffect(() => {
        
    }, []);

    React.useEffect(() => {
        if (inputRef.current !== null && isEditingTitle) {
            inputRef.current.focus();
        }

        function onMouseDown(event: MouseEvent) {
            if (isEditingTitle || isEditingContent) {
                if (noteRef.current == null) return;
                if (noteRef.current.contains(event.target as Node)) return;
                onSubmit();
            } else {
                if (noteRef.current === null) return;
                if (!noteRef.current.contains(event.target as Node)) return;
                isMouseDownRef.current = true;
                setTimeout(() => {
                    if (!isMouseDownRef.current) {
                        return;
                    }
                    container.setPickup(id);
                    smouseYRef.current = window.scrollY;
                    cmouseXYRef.current = { x: event.pageX, y: event.pageY };
                    setMouseXY({ x: 0, y: 0 });
                    setPickup(true);
                }, 100);
            }
        }

        function onMouseUp(event: MouseEvent) {
            isMouseDownRef.current = false;

            if (isPickup) {
                container.doMove();
                setPickup(false);
                return;
            }

            if (container.hasPickup()) return;

            if (titleRef.current === null || contentRef.current === null)
                return;
            if (titleRef.current.contains(event.target as Node)) {
                setEditingTitle(true);
            }
            if (contentRef.current.contains(event.target as Node)) {
                setEditingContent(true);
            }
        }

        function onMouseMove(e: MouseEvent) {
            if (!isPickup) return;
            setMouseXY({
                x: e.pageX - cmouseXYRef.current.x,
                y: e.pageY - cmouseXYRef.current.y,
            });
        }

        function onScroll() {
            if (!isPickup) return;
        }

        document.addEventListener("scroll", onScroll);
        document.addEventListener("mouseup", onMouseUp);
        document.addEventListener("mousedown", onMouseDown);
        document.addEventListener("mousemove", onMouseMove);
        return () => {
            document.removeEventListener("scroll", onScroll);
            document.removeEventListener("mouseup", onMouseUp);
            document.removeEventListener("mousedown", onMouseDown);
            document.removeEventListener("mousemove", onMouseMove);
        };
    }, [
        noteRef.current,
        isMouseDownRef.current,
        inputRef.current,
        titleRef.current,
        mouseXY,
        cmouseXYRef.current,
        isPickup,
        isEditingTitle,
        isEditingContent,
    ]);

    function Title() {
        function onKeyDown(e: React.KeyboardEvent) {
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
                    <MonacoReact.Editor
                        height="100%"
                        width="100%"
                        defaultLanguage="markdown"
                        value={content}
                        theme="vs-dark"
                        onMount={onEditorMounted}
                    />
                </>
            );
        } else {
            return (
                <div
                    className="no-defaults"
                    dangerouslySetInnerHTML={{ __html: Marked.marked(content) }}
                ></div>
            );
        }
    }

    function onClickDelete(e) {
        container.removeNote(id);
    }

    if (isPickup) {
        return (
            <div
                ref={noteRef}
                className={
                    "noteShape" + " " + styles.note + " " + styles.pickup
                }
                style={{
                    transform: `translate3d(${mouseXY.x}px, ${mouseXY.y}px, 0)`,
                }}
            >
                <div ref={titleRef} className={styles.noteTitle}>
                    <Title />
                </div>
                <div ref={contentRef} className={styles.noteContent}>
                    <Content />
                </div>
            </div>
        );
    }

    function onMouseEnter(event: React.MouseEvent) {
        if (!container.hasPickup()) return;
        container.setHover(id);
    }

    function onMouseLeave(event: React.MouseEvent) {
        if (!container.hasPickup()) return;
        container.setHover(null);
    }

    return (
        <div
            draggable
            ref={noteRef}
            className={"noteShape" + " " + styles.note}
            onDragStart={(e) => e.preventDefault()}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div ref={titleRef} className={styles.noteTitle}>
                <Title />
            </div>
            <div ref={contentRef} className={styles.noteContent}>
                <Content />
                <div onClick={onClickDelete} className={styles.remove}></div>
            </div>
        </div>
    );
}

export default Note;
