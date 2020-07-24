import React from "react";
import { Redirect } from 'react-router-dom'

class CreateAddress extends React.Component {
  state = {
    street_address: "",
    post_code: "",
    state: "VIC",
    redirect: null,
    data: this.props.location.state.data,
    addresses: []
  };


    componentDidMount() {
      this.getAddressData()
    }

  getAddressData = async () => {
    console.log('hit');
    const response = await fetch(`${process.env.REACT_APP_API}/addresses`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    const data = await response.json()
    this.setState({ addresses: data })
    this.setState({ userChoice: 1 })
  }

    deleteAddress = async (id) => {
    await fetch(`http://localhost:3000/addresses/${id}`, {
      method: "DELETE",
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    this.getAddressData()
  }

 renderAddresses = () => {
    return this.state.addresses.map((address, index) => {
      return (
        <div key={index} className="address">
          <h3>{address.name}</h3>
          <h4>Street Address: </h4><p>{address.street_address}</p>
          <h4>Post Code: </h4><p>{address.post_code}</p>
          <h4>State: </h4><p>{address.state}</p>
          <div className="delete-container">
            <span onClick={() => this.deleteAddress(address.id)}>Delete</span>
          </div>
          <hr />
        </div>
      );
    });
  };

  onInputChange = (event) => {

    this.setState({
      [event.target.id]: event.target.value,
    });
  };

  handleChange = (event) => {
    this.setState({ 
      state: event.target.value,
    });
  };


  form = () => {
    return (
     <div className="container">
        <h1>Add a address</h1>
        <form onSubmit={this.onFormSubmit}>
          <label htmlFor="name">Street Address</label>
          <input
            type="text"
            name="street_address"
            id="street_address"
            onChange={this.onInputChange}
          />

          <label htmlFor="post_code">Post code</label>
          <textarea
            name="post_code"
            id="post_code"
            onChange={this.onInputChange}
          ></textarea>
          <label htmlFor="state"> State</label>
          <select defaultValue={this.state.value} onChange={this.handleChange}>
            <option value="VIC">VIC</option>
            <option value="TAS">Tasmania</option>
            <option value="NSW">NSW</option>
            <option value="ACT">ACT</option>
            <option value="WA">WA</option>
          </select>
          <input type="submit" value="Submit" />
        </form>
      </div>

    );
  };

  onFormSubmit = async (event) => {
    event.preventDefault();

    await fetch(`${process.env.REACT_APP_API}/addresses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ address: this.state }),
    });
    this.setState({ redirect: "/Confirm" });
  };

  // {address: this.state.address, post_code: this.state.post_code, state: this.state.value}

  render() {
    if (this.state.redirect) {
      return (
        <Redirect
          to={{
            pathname: this.state.redirect,
            state: { data: this.state },
          }}
        />
      );
    }
    return (
      <>
             <div>{this.form()}</div>
<div>
  {this.renderAddresses()}
  </div>
</>
    );
  }
}

export default CreateAddress;
