import { useEffect } from "react"
import './App.css';

function App() {

  function handleCallbackResponse(response) {
    console.log("Encoded JWT ID TOKEN: "+ response.credential)
  }

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: "877648253534-lll7jmdkvju12gjim86hg18e2fbbm7f9.apps.googleusercontent.com",
      callback: handleCallbackResponse
    })

    google.accounts.id.renderButton(
      document.getElementById('signInDiv'),
      {theme: "outline", size:"large"}
    )
  }, []);

  return (
    <div className="App">
      <div id="signInDiv"></div>
    </div>
  );
}

export default App;
