import { create } from 'apisauce';
import Cookie from "js-cookie"

const api = create({
	baseURL: '/',
});

api.addAsyncRequestTransform(request => async () => {
	const token = 
	    Cookie.get('token')

	if(token)
		request.headers['Authorization'] = `Bearer ${token}`;
});

api.addResponseTransform(response => {
	if(!response.ok) throw response;
})

export default api;