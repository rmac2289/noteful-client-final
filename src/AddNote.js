import React from 'react';
import NotefulContext from './NotefulContext';
import config from './config';
import ErrorMsg from './ErrorMsg/ErrorMsg';
import './NotefulForm/NotefulForm.css';

export default class AddNote extends React.Component {
    state = {
        name: "",
        content: "",
        folderSelect: "",
        folder_id: "",
        formValid: false,
        titleValid: false,
        contentValid: false,
        folderSelectValid: false,
        validationMessage: null
    };

    static contextType = NotefulContext;

    goBack = () => {
        this.props.history.goBack();
    }

    updateFormEntry(e) {       
        const name = e.target.name;
        const value = e.target.value;
        let id;
        if (e.target.selectedOptions) {
            id = e.target.selectedOptions[0].id;
            this.setState({
                folder_id : id 
            })
        }
        this.setState({
            [e.target.name]: e.target.value,
            
        }, () => {this.validateEntry(name, value)});
    }

    validateEntry(name, value) {
        let hasErrors = false;

        value = value.trim();
        if((name === 'title') || (name === 'content')) {
            if (value.length < 1) {
                hasErrors = true
            } 

            else {
                hasErrors = false
            }
        }
        
        else if((name === 'folderSelect') && (value === 'Select')) {
            hasErrors = true
        }
        
        else {
            hasErrors = false
        }
        
        this.setState({
            [`${name}Valid`]: !hasErrors,
        }, this.formValid );
    }

    formValid() {
        const { titleValid, contentValid, folderSelectValid } = this.state;
        if (titleValid && contentValid && folderSelectValid === true){
            this.setState({
                formValid: true,
                validationMessage: null
            });
        }
        else {this.setState({
            formValid: !this.formValid,
            validationMessage: 'All fields are required.'
        })}
      }

    handleSubmit(e) {
        e.preventDefault();
        const { name, content, folder_id } = this.state;
        const note = {
            name: name,
            content: content,
            folder_id: folder_id,
            date_modified: new Date()
        }

        this.setState({error: null})

        
        fetch(`${config.API_ENDPOINT}/notes`, {
            method: 'POST',
            body: JSON.stringify(note),
            headers: {
                'content-type': 'application/json'
            }
        })
        .then(res => {
            if (!res.ok) {
                return res.json().then(err => {
                    console.log(`Error is: ${err}`)
                    throw err
                })
            }
            return res.json()
        })
        .then(data => {
            this.goBack()
            this.context.addNote(data)
        })
        .catch(err => {
            this.setState({ err })
        })
    }

    
    render() {
        const folders = this.context.folders;
        const options = folders.map((folder) => {
            return(
            <option 
                key ={folder.id} 
                id={folder.id}>
            {folder.folder_name}
            </option>
            )
        })
        
        return (
            <form 
                className="Noteful-form"
                onSubmit={e => this.handleSubmit(e)}>
                <h2 className="title">Add Note</h2>
                <ErrorMsg
                    validationMessage={this.state.validationMessage}
                />
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input 
                    type="text" 
                    className="field"
                    name="name" 
                    id="title" 
                    aria-label="Title"
                    aria-required="true"
                    placeholder="Note Title"
                    onChange={e => this.updateFormEntry(e)}/>
                </div>
                <div className="form-group">
                   <label htmlFor="content">Note:</label>
                   <textarea 
                        className="field"
                        name="content" 
                        id="content"
                        aria-label="Note:"
                        aria-required="false"
                        onChange={e => this.updateFormEntry(e)}/>
                </div>
                <div className="form-group">
                  <label htmlFor="folder-select">folder</label>
                  <select 
                    type="text" 
                    className="field"
                    name="folderSelect" 
                    id="folder-select" 
                    aria-label="folder"
                    aria-required="true"
                    ref={this.folderSelect}
                    onChange={e => this.updateFormEntry(e)}>
                        <option>Select</option>
                        { options }
                    </select>
                </div>
                <div className="buttons">
                 <button 
                    type="button" 
                    className="button"
                    onClick={()=> this.goBack()}>
                     Cancel
                 </button>
                 <button 
                    type="submit" 
                    className="button">
                     Save
                 </button>
                </div>
            </form> 
        )
    }
}