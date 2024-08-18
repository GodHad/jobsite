import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {useEffect,useState} from "react"
import dynamic from 'next/dynamic'
const Editor = dynamic(
    () => {
        return import('react-draft-wysiwyg').then((mod) => mod.Editor);
    },
    { loading: () => null, ssr: false },
);

export function JobDescriptionEditor({editorState, onEditorStateChange, onEditorChange, defaultContentState} ){
    const [showEditor, setShowEditor] = useState(false)
    useEffect(() => {
        setShowEditor(true)
    }, [])

    return (
            <>
                {/*{*/}
                {/*    showEditor?*/}
                        <Editor
                            editorState={editorState}
                            toolbarClassName="toolbarClassName"
                            wrapperClassName="wrapperClassName"
                            editorClassName="editorClassName"
                            onEditorStateChange={onEditorStateChange}
                            onChange={onEditorChange}
                            // defaultContentState={defaultContentState}
                        />
                {/*        : <></>*/}
                {/*}*/}
{/*<style jsx>{`*/}
{/*.editorClassName {*/}
{/*    background-color: rgb(82 63 105 / 4%);*/}
{/*}*/}
{/*`}</style>*/}

            </>
    )
}