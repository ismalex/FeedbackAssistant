//USER SERVICES
	export const userService = {
		/* login.*/
		setAccessToken,
		setUserId,
		getModulesUser,
		setSession,
		logOut
	};

	const baseURL = '/webfeedback/public/api/'


	/**login functions**/
	//set the acces token to local storage once the user is authenticated
	function setAccessToken(email, password) {
		axios
			.post(baseURL+'login', { username: email, password: password })
			.then((response) => {
				if(response.status !== 200){
					if (response.status === 401) {
						// auto logout if 401 response returned from api
					  	logOut();
					}
					console.log('Error:', response.status);
					return;
				}
				localStorage.setItem('access_token', response.data.success.access_token)
				/* console.log(response.data.success.access_token) */
			})
	}

	//set the user id on local storage MUST BE DONE ON LOGIN 
	function setUserId() {
		if(!getAuthHeader()){
			//logOut();
			console.log('logout')
			return;
		}
		axios.defaults.headers.common['Authorization'] = getAuthHeader();
			axios
				.get(baseURL + 'user')
				.then((response) => {
					const user = JSON.stringify({"u":response.data.id})
					localStorage.setItem('u_token', user)
				})
	}
	
	//Get the data directly from the localStorage
	function getSession(token_name){
		let info = localStorage.getItem(token_name);
		if (info){
			return JSON.parse(info);
		} 
		else{
			return null;
			//logOut
		}
	}

	//get the modules linked ot a user
	function getModulesUser() {
		if(!getAuthHeader()){
			//logOut();
			console.log('logout')
			return;
		}
		
		axios.defaults.headers.common['Authorization'] = getAuthHeader();
		return axios.get(baseURL + 'user/modules/') 
	}
	
	//set session data on local storage in JSON format 
	function setSession(tokenName, sessionData) {
		//if it exists replace
		//else create
		localStorage.setItem(tokenName, JSON.stringify(sessionData));
	}
	
	// return the user autorization token data from the session storage
	export const getAuthHeader = () => {
		const userToken = localStorage.getItem('access_token');
		if (userToken){
			return 'Bearer ' + userToken;
		} 
		else{
			return null;
		}
	}

	/**logOut**/
	function logOut() {
		
		// remove user from local storage to log user out
		localStorage.clear();
	/* 	localStorage.removeItem('access_token');
		localStorage.removeItem('u_token');
		localStorage.removeItem('s_token');
		localStorage.removeItem('d_token'); */
	}


//SUBTITLE SERVICES
	export const subtitleService = {
		getSubTitleInfo,
	}

	function getSubTitleInfo(){
		if(!getAuthHeader()){
			//logOut();
			console.log('logout')
			return;
		}

		const params = {
			module_id: getSession('d_token').mod,
			template_id: getSession('d_token').as,
			student: getSession('s_token').s
		  }
		  
		axios.defaults.headers.common['Authorization'] = getAuthHeader();
		return axios.get(baseURL + 'module/subtitle/', { params })
	}

//STUDENT SERVICES
	export const studentService = {
		getList,
		sendEmailStudents
	};

	// Get students linked to a user 
	function getList() {
		if(!getAuthHeader()){
			//logOut();
			console.log('logout')
			return;
		}
		/* let moduleId = getSession('d_token').mod */
		const params = {
			module_id: getSession('d_token').mod,
            template_id: getSession('d_token').as
		  }
		  
		axios.defaults.headers.common['Authorization'] = getAuthHeader();
		return axios.get(baseURL + 'module/students/', { params })
		
	
		/* return axios.get(baseURL + 'module/students/'+ moduleId)   */
	}

	//send emal to the selected students 
	function sendEmailStudents(moduleId, templateId, studentList) {
		if(!getAuthHeader()){
			//logOut();
			console.log('logout')
			return;
		}
		/* let moduleId = getSession('d_token').mod */
		const params = {
			module_id: moduleId,
			marking_sheet_id: templateId,
			studentList: studentList
		  }
		  
		axios.defaults.headers.common['Authorization'] = getAuthHeader();
		return axios.get(baseURL + 'module/sendmail', { params })
	}


//MARKING TEMPLATE SERVICES
	export const templateService = {
		getTemplate,
		saveTemplate,
	};

	function getTemplate() {
		if(!getAuthHeader()){
			//logOut();
			console.log('logout')
			return;
		}
		let templateId = getSession('d_token').as
		
		axios.defaults.headers.common['Authorization'] = getAuthHeader();
		return axios.get(baseURL + 'module/markingtemplate/' + templateId)  

	}

	function saveTemplate(data) {
		if(!getAuthHeader()){
			//logOut();
			console.log('logout')
			return;
		}

		const sendData = {
            student_id: getSession('s_token').s,
            module_id: getSession('d_token').mod,
            marking_sheet_id: getSession('d_token').as,
            formData: data
		}
		
	 	axios.defaults.headers.common['Authorization'] = getAuthHeader();
		return axios.post(baseURL + 'markingsheet/store' , sendData) 

	}

//DOCUMENT REVIEW
	export const reviewService = {
		getDocument, 
		generatePDF
	}

	function getDocument() {
		if(!getAuthHeader()){
			//logOut();
			console.log('logout')
			return;
		}

		axios.defaults.headers.common['Authorization'] = getAuthHeader();
		const params = {
			module_id: getSession('d_token').mod,
            marking_sheet_id: getSession('d_token').as,
			student_id: getSession('s_token').s 
		  }
		  
		return axios.get(baseURL + 'markingsheet/review', { params } ) 

	}

	function generatePDF( ) {
		if(!getAuthHeader()){
			//logOut();
			console.log('logout')
			return;
		}

		axios.defaults.headers.common['Authorization'] = getAuthHeader();
 	 	const params = {
			module_id: getSession('d_token').mod,
            marking_sheet_id: getSession('d_token').as,
			student_id: getSession('s_token').s 
		  }  
		return axios.get(baseURL + 'markingtemplate/pdf', { params } ) 

	}

	function getTitle(){
		//make a function to get the data to show on subtitles
		//add a api route to get the data from the dabatase
		//use that api function to geth the data for the header on the document 
	}


//SETTINGS
//MODULES
	export const moduleService = {
		settGetModules,
		settSaveModule, 
		settDeleteModule
	}

	function settGetModules() {
		if(!getAuthHeader()){
			//logOut();
			console.log('logout')
			return;
		}

		axios.defaults.headers.common['Authorization'] = getAuthHeader();
		return axios.get(baseURL + 'settings/modules/all')

	}

	function settSaveModule(saveData) {
		if(!getAuthHeader()){
			//logOut();
			console.log('logout')
			return;
		}

		axios.defaults.headers.common['Authorization'] = getAuthHeader();
		return axios.post(baseURL + 'settings/modules/store', saveData)

	}

	function settDeleteModule(moduleId){
		if(!getAuthHeader()){
			//logOut();
			console.log('logout')
			return;
		}

		axios.defaults.headers.common['Authorization'] = getAuthHeader();
		return axios.delete(baseURL + 'settings/modules/delete/'+ moduleId)
	}

//TEMPLATES
	export const markingService = {
		settGetTemplates,
		settGetModTemplates,
		settGetUnTemplates,
		settSaveTemplate,
		settDelTemplate,
		settUpdateTemplate
	}

	//get all the templates on the data Base
	function settGetTemplates() {
		if(!getAuthHeader()){
			//logOut();
			console.log('logout')
			return;
		}

		axios.defaults.headers.common['Authorization'] = getAuthHeader();
		return axios.get(baseURL + 'settings/templates/all')	
	}

	//get the templates assigned to a module by moduleId
	function settGetModTemplates(moduleId) {
		if(!getAuthHeader()){
			//logOut();
			console.log('logout')
			return;
		}

		axios.defaults.headers.common['Authorization'] = getAuthHeader();
		return axios.get(baseURL + 'settings/templates/list/'+ moduleId)	
	}

	function settGetUnTemplates(moduleId) {
		if(!getAuthHeader()){
			//logOut();
			console.log('logout')
			return;
		}
		
		axios.defaults.headers.common['Authorization'] = getAuthHeader();
		return axios.get(baseURL + 'settings/templates/unlist/' + moduleId)	
	}
	
	
	function settSaveTemplate(data) {
		if(!getAuthHeader()){
			//logOut();
			console.log('logout')
			return;
		}

		axios.defaults.headers.common['Authorization'] = getAuthHeader();
		return axios.post(baseURL + 'settings/templates/store', data )	

	}
	
	function settUpdateTemplate(moduleId, templateId) {
		if(!getAuthHeader()){
			//logOut();
			console.log('logout')
			return;
		}
		const params = {
			module_id: moduleId,
            template_id: templateId
		  }

		axios.defaults.headers.common['Authorization'] = getAuthHeader();
		return axios.get(baseURL + 'settings/templates/assgin/', { params } )	

	}

	function settDelTemplate(moduleId, templateId) {
		if(!getAuthHeader()){
			//logOut();
			console.log('logout')
			return;
		}

		axios.defaults.headers.common['Authorization'] = getAuthHeader();
		const params = {
			module_id: moduleId,
            template_id: templateId
		  }
		return axios.get(baseURL + 'settings/templates/delete', { params } )
	}


//LEARNING OUTCOMES
	export const learnService = {
		settGetLearn,
		settSaveLearn, 
		settDelLearn
	}

	function settGetLearn() {
		if(!getAuthHeader()){
			//logOut();
			console.log('logout')
			return;
		}
		const templateId = getSession('sett_token').set

		axios.defaults.headers.common['Authorization'] = getAuthHeader();
		return axios.get( baseURL + 'settings/templates/learning/'+ templateId )
	}

	function settSaveLearn(data) {
		if(!getAuthHeader()){
			//logOut();
			console.log('logout')
			return;
		}
		
		const sendData = {
            template_id: getSession('sett_token').set,
			short_comment: data.short_comment,
			long_comment: data.long_comment
		}

		axios.defaults.headers.common['Authorization'] = getAuthHeader();
		return axios.post( baseURL + 'settings/templates/learning/save', sendData )

	}

	function settDelLearn(learnId) {
		if(!getAuthHeader()){
			//logOut();
			console.log('logout')
			return;
		}

		axios.defaults.headers.common['Authorization'] = getAuthHeader();
		return axios.delete( baseURL + 'settings/templates/learning/delete/' + learnId )
	}

//GROUPS/ITEMS 
	export const groupIitemService = {
		//TEMPLATE TITLE
		settTemplateName,
		//GROUPS
		settGetGroup,
		settSaveGroup,
		settDelGroup,
		//ITEMS
		settDelItem,
		settSaveItem,
		settGetItem,
	}
	//Template
	function settTemplateName() {
		if(!getAuthHeader()){
			//logOut();
			console.log('logout')
			return;
		}
		let templateId = getSession('sett_token').set;

		axios.defaults.headers.common['Authorization'] = getAuthHeader();
		return axios.get( baseURL + 'settings/templates/title/'+ templateId )
	}
	//GROUPS
	function settGetGroup() {
		if(!getAuthHeader()){
			//logOut();
			console.log('logout')
			return;
		}
		let templateId = getSession('sett_token').set;

		axios.defaults.headers.common['Authorization'] = getAuthHeader();
		return axios.get( baseURL + 'settings/templates/groups/'+ templateId )
	}

	function settSaveGroup(data) {
		if(!getAuthHeader()){
			//logOut();
			console.log('logout')
			return;
		}

		const sendData = {
			template_id: getSession('sett_token').set,
			title: data.title,
			char: data.char,
			total_mark: data.totalMark
		}

		axios.defaults.headers.common['Authorization'] = getAuthHeader();
		return axios.post(baseURL + 'settings/templates/groups/save', sendData)

	}

	function settDelGroup(groupId) {
		if(!getAuthHeader()){
			//logOut();
			console.log('logout')
			return;
		}

		axios.defaults.headers.common['Authorization'] = getAuthHeader();
		return axios.delete( baseURL + 'settings/templates/groups/delete/' + groupId )
	}

	//ITEMS
	function settGetItem(groupId) {
		if(!getAuthHeader()){
			//logOut();
			console.log('logout')
			return;
		}

		axios.defaults.headers.common['Authorization'] = getAuthHeader();
		return axios.get( baseURL + 'settings/templates/groups/items/'+ groupId )

	}
 
	function settSaveItem(groupId, data) {
		if(!getAuthHeader()){
			//logOut();
			console.log('logout')
			return;
		}
		
		const sendData = {
            group_id: groupId,
			short_comment: data.short_comment,
			long_comment: data.long_comment
		}

		axios.defaults.headers.common['Authorization'] = getAuthHeader();
		return axios.post( baseURL + 'settings/templates/groups/items/save', sendData )
	}

	function settDelItem(itemId){
		if(!getAuthHeader()){
			//logOut();
			console.log('logout')
			return;
		}

		axios.defaults.headers.common['Authorization'] = getAuthHeader();
		return axios.delete( baseURL + 'settings/templates/groups/items/delete/' + itemId )
	}

	
	export const markService  = {
		getMakrStudents,
	}

	function getMakrStudents(moduleId, templateId) {
		if(!getAuthHeader()){
			//logOut();
			console.log('logout')
			return;
		}

		axios.defaults.headers.common['Authorization'] = getAuthHeader();
		const params = {
			module_id: moduleId,
            marking_sheet_id: templateId
		  }
		  
		return axios.get(baseURL + 'settings/students/feedback', { params } ) 

	}