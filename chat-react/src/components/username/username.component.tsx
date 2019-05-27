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
                localStorage.setItem('username', this.state.username);
                localStorage.setItem('role', this.state.selectedOption);
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
                    if (this.playerCount === 2) {
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
                <div className="row">Expression Nook</div>
                <form>
                    <label className="form-group row" htmlFor="username">Enter a username: </label>
                    <input onChange={(event: any) => this.setState({username: event.target.value})} className="form-group row" id="username" value={this.state.username}/>
                    <button type="submit" className="form-group row btn btn-primary" onClick={this.handleSubmit}>submit</button>
                    <table>
                        <tr>
                            <input id ="speak" type="radio" checked={this.state.selectedOption==='speak'} value="speak" onChange={this.handleRadio} disabled={this.state.speaker ? true : false}/>
                            <label htmlFor="speak"> Speak </label>
                        </tr>
                        <tr>
                            <input id="listen" type="radio" checked={this.state.selectedOption==='listen'} value="listen" onChange={this.handleRadio}/>
                            <label htmlFor="listen"> Listen </label>
                        </tr>
                    </table>
                </form>
                <span className="row">{this.state.waitMessage}</span>
            </div>
        );
    }
}