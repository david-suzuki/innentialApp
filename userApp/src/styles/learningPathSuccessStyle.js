import css from "styled-jsx/css";
import variables from "./variables";

export const learningPathSuccessStyle = css.global`
	.discussion {
		text-align: left;
	}

	.discussion__title {
		color: ${variables.textColor};
		font-size: 1.5em;
		line-height: 2.375em;
		font-weight: ${variables.bold};
		text-align: left;
	}

	.discussion__title-small {
		color: ${variables.veryDarkBlue};
		font-size: 1em;
		line-height: 1.625em;
		font-weight: ${variables.bold};
		text-align: left;
		padding: 1.625em 0 0;
	}

	.discussion__content {
		display: flex;
		gap: 1.5em;
	}

	@media (max-width: 1024px) {
		.discussion__content {
			flex-direction: column;
		}
	}

	.discussion__content-form {
		flex: 1;
		max-width: fit-content;
	}

	.discussion__content-questions {
		flex: 1;
		padding-top: 3em;
	}

	.discussion__content-questions__title {
		color: ${variables.veryDarkBlue};
		font-size: 1em;
		line-height: 1.625em;
		font-weight: ${variables.bold};
		text-align: left;
		margin-bottom: 22px;
	}

	.discussion__button {
		display: inline-block;
		line-height: 1;
		white-space: nowrap;
		cursor: pointer;
		border: 1px solid #5a55ab;
		color: #6b66b3;
		-webkit-appearance: none;
		text-align: center;
		box-sizing: border-box;
		outline: none;
		margin: 0;
		transition: 0.1s;
		font-weight: 500;
		-moz-user-select: none;
		-webkit-user-select: none;
		-ms-user-select: none;
		font-size: 12px;
		border-radius: 100px;
		font-weight: ${variables.bold};
		padding: 8px 20px;
		letter-spacing: 0.008em;
		display: flex;
		align-items: center;
		gap: 0.5em;
		float: right;
		background: inherit;
	}

	.discussion__button--hover {
		background: #7b77bc;
		border-color: #5a55ab;
		color: #ffffff;
	}
`;
export default learningPathSuccessStyle;
