
## A simple project management system 

I'm trying to do a web app whereby on load, it will show the list of projects in card form. Upon clicking each project, it will go to the next page (project page), the list of tasks (in card form) will show in this page. Click again on each task, and a popup will show the list of todos for this task. 

This project is using the create-react-app boilerplate. 


## Below document updated for fixes 3 July 2019

### Frameworks / libraries used

- React
- MobX
- Antd Design
- React-router
- Sass

### Observables / Stores

- CommonStore.js
- ProjectStore.js

As time and date are used across all the pages, I created a separate store to store commonly used components. 

ProjectJS file contain the full data structure and logic.

### Manipulating Projects data

    const addProject = action((key) => {

		ob.dataList.set('project'+key, {
			id: key,
			name: 'Project name ' + key,
			features: observable.map({
			}),
			lastUpdated: CommonStore.getCurrentDateTime(),
			featureLastCount: 0
		});
		
		for(var i = 0; i < initialFeatureCount; i++) {
			addFeature('project'+key, i);
		}

	});

ob.dataList would be used to hold all the data in it. All projects are pushed into ob.dataList.

ob.dataList.set() is used to store the key of the project.

featureLastCount is used for taking down the id of the last feature on the project. When features are removed dynamically, it should record the last feature count, so the same id would not be used for new features added.

'project' + key is passed into the addFeature() function to take note of which project's features I'm manipulating. 

    const removeProject = action((key) => {
    	  ob.dataList.delete(key);
    });

Removing an object from the array is done easily by passing in the object key to delete. 

### Manipulating Features data

	const  addFeature  =  action((projectId, key) => {
		ob.dataList.forEach((data, rowKey, map) => {
			if(rowKey  ===  projectId) {
				data['featureLastCount']++;
				data['features'].set('feature'+key, {
					id:  key,
					name:  'Feature '+key,
					completed:  false,
					todoList:  observable.map({
					}),
					lastUpdated:  CommonStore.getCurrentDateTime(),
					todoLastCount:  0
				});

				for(var  a  =  0; a  <  initialTodoCount; a++) {
					addTodo(projectId, 'feature'+key, a)
				}
			}
		});
	});

The key is passed into the addFeature function so that we can identify which project object we will be injecting the feature into. 

So as we loop through the projects list and get the project with the key, then a new feature can be pushed in the observable.map (array) of that project itself. 

### Todo 

Using the same method as in manipulating features data: 

    const  addTodo  =  action((projectId, featureId, todoKey) => {
		let  project  =  ob.dataList.get(projectId);
		let  feature  =  project['features'].get(featureId);
		feature['todoLastCount']++;
		feature['todoList'].set('todo'+todoKey, {
			name:  'Todo '  +  todoKey,
			completed:  false,
			lastUpdated:  CommonStore.getCurrentDateTime(),
		});
		project['lastUpdated'] =  CommonStore.getCurrentDateTime();
		feature['lastUpdate'] =  CommonStore.getCurrentDateTime();
	});

The parameters for todos is getting longer, as I will need to keep track of which project, and which feature I am currently manipulating for the todo. So I'm passing in the projectId, and the featureId. 

### Setting data that user input

    const setProjectName = action((index, value) => {
        ob.dataList.forEach((data, rowKey, map) => {
            if(rowKey === index) {
                data['name'] = value;
                data['lastUpdated'] = CommonStore.getCurrentDateTime();
            }
        });
    });

Similarly, the project key is passed in here as index. On the view file - ProjectList.js, the handle event would call this function to set the project name as accordingly to the observable. 