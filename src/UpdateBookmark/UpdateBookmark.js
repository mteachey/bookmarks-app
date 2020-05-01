import React, {Component} from 'react';
import BookmarksContext from  '../BookmarksContext';
import config from '../config'
import './UpdateBookmark.css'

class UpdateBookmark extends Component{

    static contextType = BookmarksContext;


    state = {
        currentId:"",
        currentTitle:"",
        currentRating:1,
        currentDescription:"",
        currentUrl:"",
        error:null,
    }

    handleChangeTitle=e=>{
        this.setState({
            currentTitle:e.target.value,
        })
    }

    handleChangeUrl=e=>{
        this.setState({
            currentUrl:e.target.value,
        })
    }

    handleChangeDescription=e=>{
        this.setState({
            currentDescription:e.target.value,
        })
    }
    handleChangeRating=e=>{
        this.setState({
            currentRating:e.target.value,
        })
    }

    handleClickCancel = () => {
        this.props.history.push('/')
        };

    handleSubmit=(e)=>{
        e.preventDefault();
        const { title, url, description, rating } =e.target;
        const updatedBookmark = {
            id:this.state.currentId,
            title:title.value,
            url:url.value,
            description:description.value,
            rating:Number(rating.value)
        }

        this.setState({error:null})
       
        fetch(`${config.API_ENDPOINT}/${this.state.currentId}`,{
            method: 'PATCH',
            body:JSON.stringify(updatedBookmark),
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${config.API_KEY}`
              },
        })
        .then(res => {
            if (!res.ok)
              return res.json().then(error => Promise.reject(error))
          })
        .then(()=>{
            console.log('patch worked')
            this.props.history.push('/')
            this.context.updateBookmark(updatedBookmark);
        })
        .catch(error=>{
            this.setState({error})
        })

    }

    componentDidMount(){
        const bookmarkId = this.props.match.params.bookmarkId;
        fetch(`${config.API_ENDPOINT}/${bookmarkId}`,{
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${config.API_KEY}`
              }
        })
            .then(res =>{
                if(!res.ok){
                    throw new Error(res.status)
                }
                return res.json()
            })
            .then(responseData =>{
                this.setState({
                    currentId:responseData.id,
                    currentTitle:responseData.title,
                    currentUrl:responseData.url,
                    currentRating:responseData.rating,
                    currentDescription:responseData.description,             
                })
            })
            .catch(error=>{
                this.setState({ error })
            })
    }

    render(){
        
        return(
           <section className='EditBookmarkForm'>
               <h2>Edit Bookmark</h2>
               <form className="EditBookmark_form"
                     onSubmit={this.handleSubmit}
               >
                   <div className="EditBookmark_error" role="alert">
                     {this.state.error && <p>Something didn't work, please try again</p>}
                   </div>
                   <div>
                        <label htmlFor='title'>
                        Title
                        {' '}
                        </label>
                        <input
                        type='text'
                        name='title'
                        id='title'
                        value={this.state.currentTitle}
                        onChange={this.handleChangeTitle}
                        />
                    </div>
                    <div>
                        <label htmlFor='url'>
                        URL
                        {' '}                       
                        </label>
                        <input
                        type='url'
                        name='url'
                        id='url'
                        value={this.state.currentUrl}
                        onChange={this.handleChangeUrl}
                        />
                    </div>
                    <div>
                        <label htmlFor='description'>
                        Description
                        </label>
                        <textarea
                        name='description'
                        id='description'
                        value={this.state.currentDescription}
                        onChange={this.handleChangeDescription}
                        />
                    </div>
                    <div>
                        <label htmlFor='rating'>
                        Rating
                        {' '}                       
                        </label>
                        <input
                        type='number'
                        name='rating'
                        id='rating'                        
                        min='1'
                        max='5'
                        value={this.state.currentRating}
                        onChange={this.handleChangeRating}
                        />
                    </div>
                    <div className="form__button__group">           
                        <button
                        type="submit"
                        className="form__button"
                        >
                        Update Bookmark
                        </button>
                        <button type='button' onClick={this.handleClickCancel}>
                        Cancel
                        </button>
          </div>

               </form>
           </section>
        )
    }
}
export default UpdateBookmark;