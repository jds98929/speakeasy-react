import * as React from 'react';
import { RouteComponentProps } from '../../../node_modules/@types/react-router';

interface IProps extends RouteComponentProps<any>{
    socket: any
}

export class UsernameComponent extends React.Component<IProps, any> {

    public playerCount = 0;

    public constructor(props: IProps) {
        super(props);
        this.state = {
            selectedOption: 'listen',
            speaker: false,
            username: '',
            waitMessage: ''
        }
    }

    public componentDidMount() {
        this.props.socket.on('speaker status', (data: boolean) => {
            if(data === true) {
                this.setState({speaker: true});
            }
        });
        this.props.socket.emit('check speaker');
        this.props.socket.on('count', (data: number) => {
            this.playerCount = data;
        })
        this.props.socket.on('handle', (data: any) => {
            if (data.reply === 'success') {
                this.props.history.push('/home');
            } else if (data.reply === 'taken') {
                alert('This username is already taken, try another one.');
                this.setState({
                    username: ''
                })
            } else {
                this.setState ({
                    waitMessage: 'Waiting for partners...'
                })
                setInterval(() => {
                    this.props.socket.emit('check count');
                    if (this.playerCount >= 2) {
                        this.props.history.push('/home');
                    } 
                }, 1000);
            }
        })
    }

    public handleRadio = (event: any) => {
        this.setState({
            selectedOption: event.target.value
        })
    }

    public handleSubmit = (event: any) => {
        event.preventDefault();
        this.props.socket.emit('handle', {role: this.state.selectedOption, username: this.state.username});        
    }

    public render() {
        return(
            <div>
                <h1 id="username-header">Expression Nook</h1>
                <form>
                    <label className="row justify-content-center" htmlFor="username">Enter a username: </label>
                    <input onChange={(event: any) => this.setState({username: event.target.value})} className="form-control row" id="username" value={this.state.username}/>
                    <button type="submit" className="form-control row btn btn-primary" onClick={this.handleSubmit}>Join In</button>
                    <div id="role-container" className="row form-group">
                        <input className="col" id ="speak" type="radio" checked={this.state.selectedOption==='speak'} value="speak" onChange={this.handleRadio} disabled={this.state.speaker ? true : false}/>
                        <label htmlFor="speak"> Speak </label>
                        <input className="col" id="listen" type="radio" checked={this.state.selectedOption==='listen'} value="listen" onChange={this.handleRadio}/>
                        <label htmlFor="listen"> Listen </label>                      
                    </div>
                </form>
                <span className="row">{this.state.waitMessage}</span>
            </div>
        );
    }
}