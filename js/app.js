const db = firebase.firestore();

const taskForm = document.getElementById('task-form');
const taskContainer = document.getElementById('task-container');

const saveTask = (title, description) => {
    db.collection('tasks').doc().set({
        title,
        description
    });
}

const getTasks = () => db.collection('tasks').get();

const getTask = id => db.collection('tasks').doc(id).get();

const onGetTask = (callback) => db.collection('tasks').onSnapshot(callback);

const deleteTask = id => db.collection('tasks').doc(id).delete();

window.addEventListener('DOMContentLoaded', async (e) => {  
    await onGetTask((querySnapshot)=> {
        taskContainer.innerHTML = '';
        querySnapshot.forEach(doc => {
            const task = doc.data();
            task.id = doc.id;
            //console.log(task);
    
            taskContainer.innerHTML+= `<div class="card card-body mt-2">
                <h3 class="h5">
                ${task.title[0].toUpperCase()+task.title.slice(1)}
                </h3>
                <p>${task.description}</p>
                <div>
                <button class="btn btn-primary btn-delete" data-id="${task.id}">Delete</button>
                <button class="btn btn-secondary btn-edit" data-id="${task.id}">Edit</button>
                </div>
            </div>`; 

            const btnsDelete = document.querySelectorAll('.btn-delete');
            btnsDelete.forEach( btn => {
                btn.addEventListener('click',async (e) => {
                    await deleteTask(e.target.dataset.id);
                });
            });

            const btnsEdit = document.querySelectorAll('.btn-edit');
            btnsEdit.forEach( btn => {
                btn.addEventListener('click',async (e) => {
                    const task = await getTask(e.target.dataset.id);
                    console.log(task.data());
                });
            });
            
        });
    });
});

taskForm.addEventListener('submit',async (e) =>{
    e.preventDefault();

    const title = taskForm['task-title'];
    const description = taskForm['task-description'];

    await saveTask(title.value,description.value);
    


    taskForm.reset();
    title.focus();
 
})