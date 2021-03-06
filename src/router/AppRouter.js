import React from 'react'
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import { LoginScreen } from '../components/auth/LoginScreen'
import { CalendarScreen } from '../components/calendar/CalendarScreen'


export const AppRouter = () => {
    return (
       <Router>
            <div>
                <Switch>
                        <Route exact path="/" component={CalendarScreen} />
                        <Route exact path="/login" component={LoginScreen} />
                </Switch>
            </div>
       </Router>
    )
};
