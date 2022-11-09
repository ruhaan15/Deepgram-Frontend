import React, { Component} from "react";
import axios from "axios"
import './App.css';

class App extends Component  {
  constructor(props) {
    super(props);
    this.state = { apiResponse: "" };
  }

  state = {
    // Initially, no file is selected
    selectedFile: null,
    files: null
  };

  // On file select (from the pop-up)
  onFileChange = event => {
    // Update the state
    console.log(event.target.files[0])
    this.setState({ selectedFile: event.target.files[0] });

  };

  // On file upload (click the upload button)
  onFileUpload = event => {
    event.preventDefault()
    // Create an object of formData
    const formData = new FormData();

    // Update the formData object
    formData.append(
        "file",
        this.state.selectedFile,
    );
    // Details of the uploaded file
    console.log(formData);

    // Request made to the backend api
    // Send formData object

    axios.post("http://localhost:5000/api/v1/audio/upload", formData)
        .then(function (response) {
          console.log(response);
          alert("Nice! You successfully uploaded a video")
        })
        .catch(function (err) {
          console.log(err.response.data);
        });
  };

  onGetFiles = async (event) => {
    // event.preventDefault()
    let response = await axios.get("http://localhost:5000/api/v1/audio/list")
    let files_list = response.data
    this.setState({ files: files_list["all_files"]})

  }

  fileData = () => {
    if (this.state.selectedFile) {
      return (
          <div>
            <p>File Name: {this.state.selectedFile.name}</p>
            <p>File Type: {this.state.selectedFile.type}</p>
            <p>
              Last Modified:{" "}
              {this.state.selectedFile.lastModifiedDate.toDateString()}
            </p>

          </div>
      );
    } else {
      return (
          <div>
            <br />
            <p>Choose a file, the details will be shown here.</p>
          </div>
      );
    }
  };

  filesData = () => {
    if(this.state.files) {
      const renderList = this.state.files.map((item, index) => 
          <div key={index}><a href={ `http://localhost:5000/api/v1/audio/file/${item}/download`}>{item}</a></div>
      )
      return (
        <div>{renderList}</div>

      )
    } else {
      return (
          <p>Click on the get files button to see more!</p>
      )
    }
  }

  // callAPI() {
  //   axios.get("http://localhost:5000/api/v1/audio")
  //       .then(res => this.setState({ apiResponse: res }));
  // }
  //
  // componentWillMount() {
  //   this.callAPI();
  // }

  render() {
    return (
        <div className="App">
          <header className="App-header">
            <p>
              Hi there, let's have some fun with audio files.
            </p>
            <div style={{border: '1px solid white', borderRadius: '20px', boxShadow: '3px 6px'}}>
              <div style={{padding: '30px'}}>
                <h5>Upload an audio file</h5>
                <form action="">
                  <input type="file" onChange={this.onFileChange}/>
                  <button onClick={this.onFileUpload}>Upload!</button>
                </form>
                <div>{this.fileData()}</div>
              </div>
            </div>

            <div style={{border: '1px solid white', borderRadius: '20px', boxShadow: '3px 6px', margin: '30px'}}>
              <p style={{padding: '20px'}}>Let's see what's been stored already</p>
              <button style={{padding: '3px', margin: '5px'}} onClick={this.onGetFiles}>Get Files!</button>
              <div>{this.filesData()}</div>
            </div>
          </header>
        </div>
    );
  }
}

export default App;
