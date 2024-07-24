import { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import SongCard from "./SongCard.js";
import { GlobalStoreContext } from "../store";
import EditToolbar from "./EditToolbar.js";
import EditSongModal from "./EditSongModal.js";
//import DeleteListModal from "./DeleteListModal.js";
import DeleteSongModal from "./DeleteSongModal.js";
/*
    This React component lets us edit a loaded list, which only
    happens when we are on the proper route.
    
    @author McKilla Gorilla
*/
function PlaylistCards() {
    const { store } = useContext(GlobalStoreContext);
    store.history = useHistory();
    //to use?
    const [show, setShow] = useState(false);
    const [index, setIndex] = useState(0);
    const [deleteShow, setDeleteModal] = useState(false);

    return (
        <div id="playlist-cards">

            <EditToolbar />
            {store.currentList.songs.map((song, index) => (

                <SongCard
                    id={"playlist-song-" + index}
                    key={"playlist-song-" + index}
                    index={index}
                    song={song}
                    editCallBack={(index) => {
                        setShow(true);
                        setIndex(index);
                    }}
                    deleteCallBack={(index) => {
                        setDeleteModal(true);
                        setIndex(index);
                    }}
                />
            ))}

            <DeleteSongModal
                show={deleteShow}
                index={index}
                setDeleteModal={setDeleteModal}
            />

            <EditSongModal show={show} index={index} setShow={setShow} />
            
        </div>
    );
}

export default PlaylistCards;