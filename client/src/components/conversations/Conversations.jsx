import axios from "axios";
import React, { useEffect, useState } from "react";
import "./conversations.css";

function Conversations({ conversation, currentUser }) {
    // useState()
    const [user, setUser] = useState(null);

    // Variabale
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

    // useEffect()
    useEffect(() => {
        const friendId = conversation.members.find(
            (m) => m !== currentUser._id
        );

        const getUser = async () => {
            try {
                const res = await axios("/users?userId=" + friendId);
                setUser(res.data);
            } catch (error) {
                console.log(error);
            }
        };
        getUser();
    }, [currentUser, conversation]);
    return (
        <div className="conversation">
            <img
                src={
                    user?.profilePicture
                        ? PF + user.profilePicture
                        : PF + "person/noAvatar.png"
                }
                alt=""
                className="conversationImg"
            />
            <span className="conversationName">{user?.username}</span>
        </div>
    );
}

export default Conversations;
