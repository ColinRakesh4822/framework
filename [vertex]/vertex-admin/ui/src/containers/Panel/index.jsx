import React from 'react';
import { useSelector } from 'react-redux';
import { Paper, Slide } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { withRouter } from 'react-router-dom';
import { ToastContainer, Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Admin, Developer, Staff } from '../Groups';

const useStyles = makeStyles((theme) => ({
	wrapper: {
		height: '100%',
		width: '100%',
		border: '1px solid rgba(32,134,146,0.2)',
		boxShadow: '0 0 0 1px rgba(32,134,146,0.06), 0 32px 80px rgba(0,0,0,0.7)',
		borderRadius: 2,
		backgroundColor: '#121025',
		transition: 'opacity 500ms',
	},
	inner: {
		position: 'relative',
		height: '100%',
	},
}));

export default withRouter(() => {
	const classes = useStyles();
	const hidden = useSelector((state) => state.app.hidden);
	const permission = useSelector(state => state.app.permission);
	const opacityMode = useSelector(state => state.app.opacity);

	const getPanel = () => {
		switch (permission) {
			case "Owner":
			case "Admin":
				return <Admin />;
			case "Developer":
				return <Developer />;
			default:
				return <Staff />;
		};
	};

	return (
		<Slide direction="up" in={!hidden}>
			<Paper
				elevation={20}
				className={classes.wrapper}
				style={{ opacity: opacityMode ? '60%' : null }}>
				<div className={classes.inner}>
					<ToastContainer
						position="bottom-right"
						newestOnTop={false}
						closeOnClick
						rtl={false}
						draggable
						transition={Flip}
						pauseOnHover={false}
					/>
					{getPanel(permission)}
				</div>
			</Paper>
		</Slide>
	);
});