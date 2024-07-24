import React, { useContext, useState } from "react";
import { GlobalStoreContext } from "../store";
import MoveSongs_Transaction from "../transactions/MoveSongs_Transaction";

function SongCard(props) {
    
    const { store, tps } = useContext(GlobalStoreContext);
    const { song, index, editCallBack, deleteCallBack } = props;
    const [isDragging, setIsDragging] = useState(false);
    const [selected, setSelected] = useState(false);

    const handleDragStart = (event) => {
        setIsDragging(true);
        event.dataTransfer.setData("song", index);
    };

    const handleDragOver = (event) => {
        setSelected(true);
        event.preventDefault();
    };

    const handleDragEnter = (event) => {
        setSelected(true);
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setSelected(false);
        let oldId = event.dataTransfer.getData("song");
        let newId = index;
        tps.addTransaction(new MoveSongs_Transaction(store, oldId, newId));
    };

    const handleDragEnd = (event) => {
        event.preventDefault();
        setIsDragging(false);
    };

    const handleDragLeave = (event) => {
        setSelected(false);
        event.preventDefault();
    };
    

    return (
        <div
            key={index}
            id={"song-" + index + "-card"}
            className={`list-card ${isDragging && "is-dragging"} ${
                selected ? "selected-list-card" : "unselected-list-card"
            }`}
            
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
            onDragLeave={handleDragLeave}
            
            draggable="true"
            onDoubleClick={() => {
                console.log(song, index);
                editCallBack(index);
            }}
        >
            {index + 1}.
            <a
                id={"song-" + index + "-link"}
                className="song-link"
                href={"https://www.youtube.com/watch?v=" + song.youTubeId}
            >
                {song.title} by {song.artist}
            </a>
            <input
                type="button"
                id={"remove-song-" + index}
                className="list-card-button"
                value={"\u2715"}
                onClickCapture={() => {
                    deleteCallBack(index);
                }}
            />
        </div>
    );
}

export default SongCard;