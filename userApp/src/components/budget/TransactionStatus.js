import React from 'react'
import transactionStatusStyle from "../../styles/transactionStatusStyle"

const TransactionStatus = (props) => {

	let statusClass, statusCircle;
	switch (props.status) {
		case "Rejected":
			statusClass = 'transactionStatus--reject';
			statusCircle = 'transactionStatus--reject-circle';
			break;
		case "Approved":
			statusClass = 'transactionStatus--approved';
			statusCircle = 'transactionStatus--approved-circle';
			break;
		default:
			statusClass = 'transactionStatus--pending';
			statusCircle = 'transactionStatus--pending-circle';
			break;
	}

	return (
		<div className={`transactionStatus ${statusClass}`}>
			<span className={`transactionStatus__circle ${statusCircle}`}></span><span>{props.status}</span>
		 <style jsx>{transactionStatusStyle}</style>
  </div>
 );
};

export default TransactionStatus;
