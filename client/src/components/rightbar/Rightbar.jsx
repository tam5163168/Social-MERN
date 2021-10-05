import React, { useContext, useEffect, useState } from "react";
import "./rightbar.css";
import { Users } from "../../dummyData";
import Online from "../online/Online";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Add, Remove } from "@mui/icons-material";

function Rightbar({ user }) {
    // Variabale
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

    // useContext()
    const { user: currentUser, dispatch } = useContext(AuthContext);

    // useState()
    const [friends, setFriends] = useState([]);
    const [followed, setFollowed] = useState(
        currentUser.followings.includes(user?._id)
    );
    console.log(followed);
    // useEffect()
    useEffect(() => {
        const getFriends = async () => {
            if (user) {
                try {
                    const friendList = await axios.get(
                        "/users/friends/" + user?._id
                    );
                    setFriends(friendList.data);
                } catch (error) {
                    console.log(error.message);
                }
            }
        };
        getFriends();
    }, [user]);

    useEffect(() => {
        setFollowed(currentUser.followings.includes(user?._id));
    }, [currentUser, user]);

    // Function
    const handleClick = async () => {
        console.log("====================================");
        console.log(followed);
        console.log("====================================");
        try {
            if (followed) {
                await axios.put("/users/" + user._id + "/unfollow", {
                    userId: currentUser._id,
                });
                dispatch({ type: "UNFOLLOW", payload: user._id });
            } else {
                await axios.put("/users/" + user._id + "/follow", {
                    userId: currentUser._id,
                });
                dispatch({ type: "FOLLOW", payload: user._id });
            }
        } catch (error) {
            console.log(error);
        }
        setFollowed(!followed);
    };

    const HomeRightBar = () => {
        return (
            <>
                <div className="birthdayContainer">
                    <img className="birthdayImg" src="assets/gift.png" alt="" />
                    <span className="birthdayText">
                        <b>Pola Fotster</b> and <b>3 other friends</b> hav a
                        birthday today
                    </span>
                </div>
                <img src="assets/ad.png" alt="ad.png" className="rightbarAd" />
                <h4 className="rightbarTitle">Online Friends</h4>
                <ul className="rightbarFriendList">
                    {Users.map((u) => (
                        <Online key={u.id} user={u} />
                    ))}
                </ul>
            </>
        );
    };

    const ProfileRightBar = () => {
        return (
            <>
                {user.username !== currentUser.username && (
                    <button
                        className="rightbarFollowButton"
                        onClick={handleClick}
                    >
                        {followed ? "unfollow" : "Follow"}
                        {followed ? <Remove /> : <Add />}
                    </button>
                )}
                <h4>User information</h4>
                <div className="rightbarInfo">
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">City:</span>
                        <span className="rightbarInfoValue">{user.city}</span>
                    </div>
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">From: </span>
                        <span className="rightbarInfoValue">{user.from}</span>
                    </div>
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">Relationship</span>
                        <span className="rightbarInfoValue">
                            {user.relationship === 1
                                ? "Single"
                                : user.relationship === 2
                                ? "Married"
                                : "-"}
                        </span>
                    </div>
                </div>
                <h4 className="rightbarTitle">User friends</h4>
                <div className="rightbarFollowings">
                    {friends.map((friend) => (
                        <Link
                            to={"/profile/" + friend.username}
                            style={{ textDecoration: "none" }}
                        >
                            <div className="rightbarFollowing">
                                <img
                                    src={
                                        friend.profilePicture
                                            ? PF + friend.profilePicture
                                            : PF + "person/noAvatar.png"
                                    }
                                    alt=""
                                    className="rightbarFollowingImg"
                                />
                                <span className="rightbarFollowingName">
                                    {friend.username}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </>
        );
    };
    return (
        <div className="rightbar">
            <div className="rightbarWrapper">
                {user ? <ProfileRightBar /> : <HomeRightBar />}
            </div>
        </div>
    );
}

export default Rightbar;
