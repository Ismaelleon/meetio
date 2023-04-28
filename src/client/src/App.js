import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './index.css';

// Import routes
import Index from './routes/Index';
import Signup from './routes/Signup';
import SignupDetails from './routes/SignupDetails';
import Signin from './routes/Signin';
import Home from './routes/Home';
import Likes from './routes/Likes';
import Matches from './routes/Matches';
import Dislikes from './routes/Dislikes';
import Profile from './routes/Profile';
import User from './routes/User';

// Import components
import Header from './routes/components/Header';
import NavigationBar from './routes/components/NavigationBar';

function App () {
    return (
	    <Router>
			<Header />
		    <Route exact path="/">
			    <Index />
		    </Route>
		    <Route exact path="/signup">
			    <Signup />
		    </Route>
		    <Route exact path="/signup-details">
			    <SignupDetails />
		    </Route>
		    <Route exact path="/signin">
			    <Signin />
		    </Route>
		    <Route exact path="/home">
			    <Home />
		    </Route>
			<Route exact path="/likes">
				<Likes />
			</Route>
		    <Route exact path="/matches">
			    <Matches />
		    </Route>
			<Route exact path="/dislikes">
				<Dislikes />
			</Route>
		    <Route exact path="/profile">
			    <Profile />
		    </Route>
			<Route path="/user">
				<User />
			</Route>
			<NavigationBar />
	    </Router>
    );
}

export default App;
