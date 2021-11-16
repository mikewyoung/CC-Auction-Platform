import React, { Component } from 'react'
import axios, {AxiosResponse} from 'axios';
import "../styles.css";

interface IProps{
    successCallback: (refresh: string, token: string) => any;
}

interface IState{
    user: string,
    password: string,
    message
}

export default class Login extends Component<IProps, IState> {
    constructor(props: IProps){
        super(props);

        this.state = {
            user: "",
            password: "",
            message: "Please enter your credentials to continue."
        }

        this.submitForm = this.submitForm.bind(this);
    }

    

    render() {
        return (
            <div className="vh-100 flex align-items-center justify-content-center">
                <form className="flex max-width-400 margin-horizontal-auto wrap row-gap-10 justify-content-center font-default shadow padding-10 border-light">
                    <div>{this.state.message}</div>
                    <input type="text" className="block full-width" placeholder="Username" value={this.state.user} onChange={(e)=>{
                        this.setState({user: e.target.value});
                    }}></input>
                    <input type="password" className="block full-width" placeholder="Password" value={this.state.password} onChange={
                        (e)=>{
                            this.setState({password: e.target.value});
                        }
                    }></input>
                    <button type="submit" className="font-default styled-button" onClick={this.submitForm}>Log in</button>
                </form>
            </div>
        )
    }

    submitForm(e){
        e.preventDefault();
        const sendData = {
                user: this.state.user,
                password: this.state.password
        }

        const self = this;

        axios.post("/login", sendData).then( (response: AxiosResponse)=>{
            const statusCode = response.status;
            console.log(response.data);
            switch (statusCode){
                case 200:{
                    self.props.successCallback(response.data.refresh, response.data.token);
                    return;
                }

                default:{
                    self.setState({message: response.data.msg});
                    return;
                }
            }
        }).catch(err=>{
            console.log(err);
            self.setState({message: err.response.data.msg});
        })
    }
}
