import React, { useContext, useRef, useState } from "react";
import "./share.css";
import {
    Cancel,
    EmojiEmotions,
    Label,
    PermMedia,
    Room,
} from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

function Share() {
    // useContext()
    const { user } = useContext(AuthContext);

    // Variable
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

    // useRef()
    const desc = useRef();

    // useState()
    const [file, setFile] = useState(null);

    // Function

    const submitHandler = async (e) => {
        e.preventDefault();
        const newPost = {
            userId: user._id,
            desc: desc.current.value,
        };
        if (file) {
            const data = new FormData();
            const fileName = file.name;
            data.append("file", file);
            data.append("name", fileName);
            newPost.img = fileName;
            try {
                await axios.post("/upload", data);
            } catch (error) {
                console.log(error);
            }
        }

        try {
            await axios.post("/posts", newPost);
            // window.location.reload();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="share">
            <div className="shareWrapper">
                <div className="shareTop">
                    <img
                        src={
                            user.profilePicture
                                ? PF + user.profilePicture
                                : PF + "person/noAvatar.png"
                        }
                        alt=""
                        className="shareProfileImg"
                    />
                    <input
                        type="text"
                        className="shareInput"
                        placeholder={
                            "What's in your mind " + user.username + "? .."
                        }
                        ref={desc}
                    />
                </div>
                <hr className="shareHr" />
                {file && (
                    <div className="shareImgContainer">
                        <img
                            src={URL.createObjectURL(file)}
                            alt=""
                            className="shareImg"
                        />
                        <Cancel
                            className="shareCancelImg"
                            onClick={() => setFile(null)}
                        />
                    </div>
                )}
                <form className="shareBottom" onSubmit={submitHandler}>
                    <div className="shareOptions">
                        <label htmlFor="file" className="shareOption">
                            <PermMedia
                                htmlColor="tomato"
                                className="shareIcon"
                            />
                            <span className="shareOptionText">
                                Photo or video
                            </span>
                            <input
                                type="file"
                                name="file"
                                id="file"
                                accept=".png,.jpeg,.jpg"
                                style={{ display: "none" }}
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                        </label>
                        <div className="shareOption">
                            <Label htmlColor="blue" className="shareIcon" />
                            <span className="shareOptionText">Tag</span>
                        </div>
                        <div className="shareOption">
                            <Room htmlColor="green" className="shareIcon" />
                            <span className="shareOptionText">Location</span>
                        </div>
                        <div className="shareOption">
                            <EmojiEmotions
                                htmlColor="goldenrod"
                                className="shareIcon"
                            />
                            <span className="shareOptionText">Feeling</span>
                        </div>
                    </div>
                    <button className="shareButton" type="submit">
                        Share
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Share;
