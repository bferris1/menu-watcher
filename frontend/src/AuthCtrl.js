export default  {
  get(endpoint){
    let headers = new Headers();
    headers.append("x-access-token", localStorage.getItem("token"));
    let options = {
      method:"GET",
      headers:headers,
    };
    //todo: better error handling
    //ideally the API would always return JSON, but it doesn't for auth errors
    return fetch(endpoint, options).then((response)=>{
      if (response.status !== 401)
        return response.json();
      else {
        this.logout();
        return {success: false, error: response};
      }
    });
  },

  post(endoint, body){
    let headers = new Headers();
    headers.append("x-access-token", localStorage.getItem("token"));
    headers.append("Content-Type", "application/json");

    let options = {
      method:"POST",
      headers:headers,
      body:JSON.stringify(body)
    };
    return fetch(endoint, options).then((response)=>{
      if (response.status !== 401)
        return response.json();
      else {
        this.logout();
        return {success: false, error: response};
      }
    });
  },

  put(endoint, body){
    let headers = new Headers();
    headers.append("Authorization", localStorage.getItem("token"));
    headers.append("Content-Type", "application/json");

    let options = {
      method:"PUT",
      headers:headers,
      body:JSON.stringify(body)
    };
    return fetch(endoint, options).then((response)=>{
      if (response.status !== 401)
        return response.json();
      else {
        this.logout();
        return {success: false, error: response};
      }
    });
  },

  delete(endoint){
    let headers = new Headers();
    headers.append("x-access-token", localStorage.getItem("token"));
    headers.append("Content-Type", "application/json");

    let options = {
      method:"DELETE",
      headers:headers,
    };
    return fetch(endoint, options).then((response)=>{
      if (response.status !== 401)
        return response.json();
      else {
        this.logout();
        return {success: false, error: response};
      }
    });
  },

  login(email, password){
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    return fetch("/api/auth",
      {
        method: "POST",
        headers:headers,
        body: JSON.stringify({email:email,password:password})
      })
      .then((response)=>{
        console.log(response.body);
        if (response.status !== 401)
          return response.json();
        else {
          this.logout();
          return {success: false, error: response};
        }
      })
      .then((response)=>{
        if (response.token){
          localStorage.setItem("token", response.token);

        }
        return response;
      })
  },

  logout(){
    localStorage.removeItem("token");
  },

  isLoggedIn(){
    return localStorage.getItem("token") !== null
  }
}