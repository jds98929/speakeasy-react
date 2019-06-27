import * as React from 'react';
import { RouteComponentProps } from '../../../node_modules/@types/react-router';

interface IProps extends RouteComponentProps<any>{
    socket: any
}

export class HomeComponent extends React.Component<IProps, any> {

    private chatRef: React.RefObject<HTMLDivElement>;
    private speakerRef: React.RefObject<HTMLDivElement>;
    private autoscrollRef: React.RefObject<HTMLInputElement>;

    public constructor(props: any) {
        super(props);
        this.autoscrollRef = React.createRef();
        this.chatRef = React.createRef();
        this.speakerRef = React.createRef();
        this.state = {
            bold: false,
            chatInput: '',
            display: '',
            handle: '',
            italic: false,
            speakerDisplay: '',
        }
    }

    public componentDidMount() {
        this.props.socket.on('user verification', (data: boolean) => {
            if (!data) {
                alert('Please enter a username and select a role');
                 this.props.history.push('/username');
            }
        });
        this.props.socket.emit('verify user');
        this.props.socket.on('chat', (data: any) => {
            let currChecked: boolean = true;
            if (this.autoscrollRef.current) {
                currChecked = this.autoscrollRef.current.checked;
            }
            data.role === 'listen' ?
                this.setState({
                    display: this.state.display + "<br/><br/><strong>" + data.handle + "</strong><span style=\"color: red; font-size: 0.8em\"> " + data.timestamp + "</span>:<br/> " + data.message, 
                }) :
                this.setState({
                    speakerDisplay: this.state.speakerDisplay + "<br/><br/><strong>" + data.handle + "</strong><span style=\"color: red; font-size: 0.8em\"> " + data.timestamp + "</span>:<br/> " + data.message, 
                });
            if (this.autoscrollRef.current) {
                this.autoscrollRef.current.checked = currChecked;
            }
        });
        const messages= this.chatRef.current;
        const autoscroll = this.autoscrollRef.current;
        let checked: boolean;
        setInterval(()=>{
            if (autoscroll) {
                checked = autoscroll.checked;
            }
            if (messages && checked) {
                messages.scrollTop = messages.scrollHeight - messages.clientHeight;
            }
        }, 1000); 
    }

    public handleBold = (event: any) => {
        event.preventDefault();
        this.setState({
            bold: !this.state.bold
        })
    }

    public handleChange = (event: any) => {
        this.setState({
            ...this.state,
            chatInput: event.target.value
        });
    }

    public handleItalic = (event: any) => {
        event.preventDefault();
        this.setState({
            italic: !this.state.italic
        })
    }

    public handleRadio = (event: any) => {
        if (event.target.checked) {
            event.target.checked = false;
        } else {
            event.target.checked = true;
        }
    }

    public handleSubmit = (event: any) => {
        event.preventDefault();
        let chatMessage:string;
        this.state.bold ? chatMessage = `<strong>${this.state.chatInput}</strong>` : chatMessage = this.state.chatInput;
        this.state.italic ? chatMessage = `<i>${chatMessage}</i>` : chatMessage = chatMessage; 
        this.props.socket.emit('chat', {
            message: chatMessage,
            timestamp: new Date().toLocaleTimeString()
        });
    }

    public render() {
        const {bold, chatInput, display, italic, speakerDisplay} = this.state;
        return (
            <div>
            <div id="speaker-container">
                <div className="text-center chat-heading-container">
                    <h3 className="header">Speak</h3>
                </div>
                <div ref={this.speakerRef} className="display" id="speaker-display" dangerouslySetInnerHTML={{__html: speakerDisplay}}></div>
            </div>
            <br/>
            <div id="chat-container">
                <div className="text-center chat-heading-container">
                    <h3 className="header">Listen</h3>
                </div>
                <div ref={this.chatRef} className="display" dangerouslySetInnerHTML={{__html: display}}></div>
                <br/>
                <form>
                    <div className="form-group row">
                        <label className="col-2 col-form-label" htmlFor="chatInput">Enter message</label> 
                        <textarea id="chatInput" className="col-10 form-control" onChange={this.handleChange} value={chatInput}></textarea>
                    </div>
                    <div className="form-group row">
                        <button type="submit" className="col-3 btn btn-primary submit-button" onClick={this.handleSubmit}>submit</button>
                        <div className="col-0.5">
                            <button className={bold ? "bold-button-active col" : "bold-button col"} onClick={this.handleBold}><strong>B</strong></button>
                        </div>
                        <div className="col-0.5">
                            <button className={italic ? "italic-button-active col" : "italic-button col"} onClick={this.handleItalic}>I</button>
                        </div>
                        <div className="col-4"></div>
                        <label htmlFor="autoscroll" className="col-1 text-left control-label"><strong>autoscroll</strong></label>
                        <input ref={this.autoscrollRef} onClick={this.handleRadio} id="autoscroll" type="radio" className="col-1 form-control" checked/>
                    </div>
                </form>
            </div>
            </div>
        );
    }
}
