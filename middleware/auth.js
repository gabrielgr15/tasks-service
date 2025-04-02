const axios = require('axios')
const redisClient = require('../redis/redisClient')
const jwt = require('jsonwebtoken')

module.exports = async function(req, res, next){
	const authHeader = req.header('Authorization')

	if (!authHeader || !authHeader.startsWith('Bearer ')){
	return res.status(401).json({ msg : 'No authorization token, access denied'  })
}
	const token = authHeader.split(' ')[1]
	if (!token){
	return res.status(401).json({msg : 'No token found'})
}	try{
	const decoded = jwt.decode(token)
	const tokenId = decoded.jti || token
	const redisKey = `blacklist:${tokenId}`
	const check = await redisClient.exists(redisKey)
	if (check === 1) {
		return res.status(401).json({error: 'Blacklisted token'})
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
		return res.status(401).json({error : 'Token verification failed with User Service',})
	}
	}catch (error){
		console.error(error)
	}
	}