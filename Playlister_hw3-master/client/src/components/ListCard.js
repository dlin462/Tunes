import { useContext, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import { GlobalStoreContext } from "../store";
import DeleteListModal from "./DeleteListModal";
/*
    This is a card in our list of playlists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [show, setShow] = useState(false);
    const selected = useMemo(
        () => store.currentList?._id === props.idNamePair._id,
        
        [store]
    );
    const { idNamePair } = props;
    const [editActive, setEditActive] = useState(selected);
    const [text, setText] = useState(idNamePair.name);
    store.history = useHistory();

    function handleLoadList(event) {
        if (!event.target.disabled) {
            let _id = event.target.id;
            if (_id.indexOf("list-card-text-") >= 0)
                _id = ("" + _id).substring("list-card-text-".length);

            // CHANGE THE CURRENT LIST
            store.setCurrentList(_id);
        }
    }

    
    useEffect(() => {
        if (editActive) {
            store.setIsListNameEditActive(idNamePair._id);
        } else {
            store.closeCurrentList();
        }
        
    }, [editActive]);

    function handleKeyPress(event) {
        if (event.code === "Enter" && text.length) {
            
            store.changeListName(idNamePair._id, text);
            setEditActive(false);
        }
    }
    function handleUpdateText(event) {
        setText(event.target.value);
    }

    let selectClass = "unselected-list-card";
    if (selected) {
        selectClass = "selected-list-card";
    }

    let cardStatus = false;
    if (store.isListNameEditActive) {
        cardStatus = true;
    }
     
    let cardElement = (
        <div
            id={idNamePair._id}
            key={idNamePair._id}
            onClick={handleLoadList}
            className={"list-card " + selectClass}
        >
            <span
                id={"list-card-text-" + idNamePair._id}
                key={"span-" + idNamePair._id}
                className="list-card-text"
            >
                {idNamePair.name}
            </span>
            <input
                disabled={cardStatus}
                type="button"
                id={"delete-list-" + idNamePair._id}
                className="list-card-button"
                value={"\u2715"}
                onClickCapture={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setShow(true);
                }}
            />
            <input
                disabled={cardStatus}
                type="button"
                id={"edit-list-" + idNamePair._id}
                className="list-card-button"
                onClickCapture={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setEditActive(true);
                }}
                value={"\u270E"}
            />

            <DeleteListModal
                idNamePair={idNamePair}
                show={show}
                setShow={setShow}
            />
        </div>
    );

    if (editActive) {
        cardElement = (
            <input
                id={"list-" + idNamePair._id}
                className="list-card"
                type="text"
                onKeyPress={handleKeyPress}
                onChange={handleUpdateText}
                defaultValue={idNamePair.name}
            />
        );
    }
    return cardElement;
}

export default ListCard;