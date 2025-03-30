const axios = require('axios')

module.exports = async function(req, res, next){
	const authHeader = req.header('Authorization')

	if (!authHeader || !authHeader.startsWith('Bearer ')){
	return res.status(401).json({ msg : 'No authorization token, access denied'  })
}
	const token = authHeader.split(' ')[1]
	if (!token){
	return res.status(401).json({msg : 'No token found'})
}
	try{
	const userServiceUrl = 'http://localhost:5000'
	const verifiedUser = await axios.post(`${userServiceUrl}/api/auth/verify`, {token})
	if (verifiedUser.status === 200 && verifiedUser.data.userId){
	req.user = { id : verifiedUser.data.userId }
	next()
}	else{
	return res.status(401).json({error : 'Token is not valid (from User Service)'})
}}	catch(err){
	console.error(err)
	res.status(401).json({error : 'Token verification failed with User Service',})
}}
