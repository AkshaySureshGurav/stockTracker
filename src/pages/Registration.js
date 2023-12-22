export default function Registration(){
    return (
        <>
            <h1 style={{paddingTop: "5vh", textAlign: "center"}}>Register</h1>
            <div class="formHolder">
                <form>
                    <div class="form-group">
                        <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Username"></input>
                    </div>
                    <div class="form-group">
                        <input type="password" placeholder="Password" class="form-control" id="exampleInputPassword1"></input>
                    </div>             
                    <div class="form-group">
                        <input type="password" placeholder="Confirm password" class="form-control" id="exampleInputPassword1"></input>
                    </div>
                    <button type="submit" class="btn btn-primary">Register</button>
                </form>
                <p style={{textAlign:"center"}}>Already have an account? <a href="/register">Sign in</a></p>
            </div>
        </>
    )
}