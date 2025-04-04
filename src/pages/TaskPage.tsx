import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonButton,
  IonInput,
  IonPage,
  IonList,
  IonItem,
  IonLabel,
  IonCheckbox,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonSpinner
} from '@ionic/react';
import { signOut } from 'firebase/auth';
import { collection, addDoc, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { useHistory } from 'react-router-dom';

interface Task {
  id?: string;
  title: string;
  completed: boolean;
}

const TaskPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    setLoading(true);
    const q = query(collection(db, 'tasks'), where('uid', '==', user?.uid));
    const querySnapshot = await getDocs(q);
    const loadedTasks: Task[] = [];
    querySnapshot.forEach((doc) => {
      loadedTasks.push({ id: doc.id, ...doc.data() } as Task);
    });
    setTasks(loadedTasks);
    setLoading(false);
  };

  const handleAddTask = async () => {
    if (taskTitle.trim() === '') return;

    const newTask: Task = {
      title: taskTitle,
      completed: false
    };

    const docRef = await addDoc(collection(db, 'tasks'), {
      ...newTask,
      uid: user?.uid
    });

    setTasks([...tasks, { ...newTask, id: docRef.id }]);
    setTaskTitle('');
  };

  const handleTaskToggle = async (index: number) => {
    const updatedTasks = [...tasks];
    const task = updatedTasks[index];
    task.completed = !task.completed;
    setTasks(updatedTasks);

    if (task.id) {
      const taskRef = doc(db, 'tasks', task.id);
      await updateDoc(taskRef, { completed: task.completed });
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    history.push('/login');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Task Manager</IonTitle>
          <IonButton slot="end" onClick={handleLogout}>Logout</IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {loading ? (
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <IonSpinner name="dots" />
          </div>
        ) : (
          <>
            <IonInput
              value={taskTitle}
              onIonChange={(e) => setTaskTitle(e.detail.value!)}
              placeholder="Enter task title"
            />
            <IonButton onClick={handleAddTask}>Add Task</IonButton>
            <IonList>
              {tasks.map((task, index) => (
                <IonItem key={task.id || index}>
                  <IonLabel>{task.title}</IonLabel>
                  <IonCheckbox
                    checked={task.completed}
                    onIonChange={() => handleTaskToggle(index)}
                  />
                </IonItem>
              ))}
            </IonList>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default TaskPage;
