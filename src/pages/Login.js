import { useRef } from "react"
import storage from "../store/storage"
import App from "../App"
export default function Login(){
    const {isLoggedin, updateLoginStatus} = storage();
    const username = useRef(null)
    const userPassword = useRef(null)

    const handleFormSubmition = (event) => {
        event.preventDefault()
        // validation part here
        updateLoginStatus(username.current.value)
    }

    if (isLoggedin) {
        return <App />
    }

    return (
        <>
        <h1 style={{paddingTop: "5vh", textAlign: "center"}}>Login</h1>
        <div className="formHolder">
            <form onSubmit={handleFormSubmition}>
                <div className="form-group">
                    <input type="text" ref={username} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Username" required></input>
                </div>
                <div className="form-group">
                    <input type="password" ref={userPassword} placeholder="Password" className="form-control" id="exampleInputPassword1" required></input>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
            <p style={{textAlign:"center", marginTop: "4vh"}}>Don't have an account yet? <a href="/register">Register now</a></p>
        </div>
        </>
    )
}