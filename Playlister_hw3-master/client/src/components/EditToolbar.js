import { useContext } from "react";
import { GlobalStoreContext } from "../store";
import { useHistory } from "react-router-dom";
import AddSongs_Transaction from "../transactions/AddSongs_Transaction";
/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/

function EditToolbar() {
    const { store, tps } = useContext(GlobalStoreContext);
    const history = useHistory();

    let enabledButtonClass = "playlister-button";

    function handleUndo() {
        store.undo();
    }
    function handleRedo() {
        store.redo();
    }
    function handleClose() {
        tps.clearAllTransactions();
        history.push("/");
        store.closeCurrentList();
    }
    const handleAdd = () => {
        let song = {
            title: "Untitled",
            artist: "Untitled",
            youTubeId: "dQw4w9WgXcQ",
        };
        //add new trans
        tps.addTransaction(
            new AddSongs_Transaction(store, store.currentList.songs.length, song)
        );
    };
    //version control
    //adding
    const canAddSong = store.currentList !== null;
    //undo
    const canUndo = tps.hasTransactionToUndo();
    //redo
    const canRedo = tps.hasTransactionToRedo();
    //close
    const canClose = store.currentList !== null;

    return (
        <span id="edit-toolbar">
            <input
                type="button"
                id="add-song-button"
                //disable
                disabled={!canAddSong}
                value="+"
                className={enabledButtonClass}
                onClick={handleAdd}
            />
            <input
                type="button"
                id="undo-button"
                disabled={!canUndo}
                value="⟲"
                className={enabledButtonClass}
                onClick={handleUndo}
            />
            <input
                type="button"
                id="redo-button"
                disabled={!canRedo}
                value="⟳"
                className={enabledButtonClass}
                onClick={handleRedo}
            />
            <input
                type="button"
                id="close-button"
                disabled={!canClose}
                value="&#x2715;"
                className={enabledButtonClass}
                onClick={handleClose}
            />
        </span>
    );
}

export default EditToolbar;