import {
    IonPage,
    IonContent,
    IonButton,
    IonText
  } from '@ionic/react';
  import { useHistory } from 'react-router-dom';
  import './Welcome.css';
  
  const Welcome: React.FC = () => {
    const history = useHistory();
  
    return (
      <IonPage>
        <IonContent>
          <div className="welcome-container">
            <IonText color="dark">
              <h1>Welcome</h1>
              <p>This is a task manager app for your daily productivity.</p>
            </IonText >
            <IonButton expand="block" onClick={() => history.push('/login')}>
              Login
            </IonButton>
            <IonButton expand="block"  onClick={() => history.push('/register')}>
              Sign Up
            </IonButton>
          </div>
        </IonContent>
      </IonPage>
    );
  };
  
  export default Welcome;
  