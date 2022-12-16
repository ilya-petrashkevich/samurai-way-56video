import React, {ComponentType, FC} from 'react';
import {
    followAC,
    InitialStateType,
    setCurrentPageAC,
    setUsersAC,
    setUsersTotalCountAC,
    unfollowAC,
    UserType
} from "../redux/users-reducer";
import {connect} from "react-redux";
import {AppStateType} from "../redux/redux-store";
import {compose, Dispatch} from "redux";
import axios from "axios/index";
import Users from "./Users";

type MapStatePropsType = {
    usersPage: InitialStateType
    pageSize: number
    totalUsersCount: number
    currentPage: number
}

type MapDispatchPropsType = {
    follow: (userId: number) => void
    unfollow: (userId: number) => void
    setUsers: (users: UserType[]) => void
    setCurrentPage: (pageNumber: number) => void
    setTotalUsersCount: (totalCount: number) => void
}

export type UsersPropsType = MapStatePropsType & MapDispatchPropsType;

class UsersContainer extends React.Component<UsersPropsType> {

    componentDidMount() {
        axios.get(`https://social-network.samuraijs.com/api/1.0/users?page=${this.props.currentPage}&count=${this.props.pageSize}`)
            .then(response => {
                this.props.setUsers(response.data.items)
                this.props.setTotalUsersCount(response.data.totalCount)
            })
    }

    // getUsers = () => {
    //     if (this.props.usersPage.users.length === 0) {
    //         axios.get('https://social-network.samuraijs.com/api/1.0/users')
    //             .then(response => {
    //                 this.props.setUsers(response.data.items)
    //             })
    //     }
    // }

    onPageChanged = (pageNumber: number) => {
        this.props.setCurrentPage(pageNumber);
        axios.get(`https://social-network.samuraijs.com/api/1.0/users?page=${pageNumber}&count=${this.props.pageSize}`)
            .then(response => {
                this.props.setUsers(response.data.items)
            })
    }

    render() {


        return <Users
            totalUsersCount={this.props.totalUsersCount}
            pageSize={this.props.pageSize}
            currentPage={this.props.currentPage}
            onPageChanged={this.onPageChanged}
            users={this.props.usersPage.users}
            follow={this.props.follow}
            unfollow={this.props.unfollow}
        />
    }
}

const mapStateToProps = (state: AppStateType): MapStatePropsType => {
    return {
        usersPage: state.usersPage,
        pageSize: state.usersPage.pageSize,
        totalUsersCount: state.usersPage.totalUsersCount,
        currentPage: state.usersPage.currentPage
    }
}
const mapDispatchToProps = (dispatch: Dispatch): MapDispatchPropsType => {
    return {
        follow: (userId: number) => {
            dispatch(followAC(userId))
        },
        unfollow: (userId: number) => {
            dispatch(unfollowAC(userId))
        },
        setUsers: (users: UserType[]) => {
            dispatch(setUsersAC(users))
        },
        setCurrentPage: (pageNumber: number) => {
            dispatch(setCurrentPageAC(pageNumber))
        },
        setTotalUsersCount: (totalCount: number) => {
            dispatch(setUsersTotalCountAC(totalCount))
        }
    }
}
export default compose<FC>(
    connect(mapStateToProps, mapDispatchToProps)
)(UsersContainer)
//const UsersContainer = connect(mapStateToProps, mapDispatchToProps)(Users /*Users*/);
// const UsersContainer = connect(mapStateToProps, mapDispatchToProps)(Users /*Users*/);
//export default UsersContainer;