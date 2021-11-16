import React, { Component } from 'react'
import Login from "./login";

type MainState = {
    token: string,
    refresh: string
}

export default class main extends Component<{}, MainState> {
    constructor(props){
        super(props);
        this.state = {token: "", refresh: ""};
        this.setToken.bind(this);
    }

    setToken = (token: string, refresh: string) => {
        this.setState({
            token: token,
            refresh: refresh
        })
    }

    render() {
        if (this.state.token === ""){
            return (<Login successCallback={this.setToken}/>)
        }else{
            return (<div>Login success!</div>);
        }
    }
}
