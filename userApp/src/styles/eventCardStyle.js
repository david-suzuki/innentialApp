import css from 'styled-jsx/css'
import variables from '$/styles/variables'

const eventCardStyle = css.global`
  .event-card__container {
    border-radius: 4px;
    background-color: ${variables.white};
    // box-shadow: 0 4px 8px 0 rgb(0 8 32 / 6%), 0 1px 4px 0 rgb(0 8 32 / 8%);
    max-width: 350px;
    width: 100%;
  }

  .event-card {
    padding: 9px 10px 8px;
  }

  .event-card__footer {
    border-top: 1px solid ${variables.hawkesBlue};
  }

  .event-card__container:hover {
    box-shadow: 0 4px 8px 0 rgb(0 8 32 / 6%), 0 1px 4px 0 rgb(0 8 32 / 8%);
  }

  .event-card__image {
    border-radius: 4px;
    width: 100%;
    object-fit: cover;
    max-height: 133px;
  }

  .event-card__details {
    position: relative;
  }

  .event-card__date {
    color: ${variables.brandSecondary};
    border-radius: 4px;
    background-color: ${variables.white};
    font-family: Poppins;
    font-size: 12px;
    height: 44px;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: fit-content;
    min-width: 60px;
    line-height: 1.1;
    box-shadow: 0 4px 8px 0 rgb(0 8 32 / 6%), 0 1px 4px 0 rgb(0 8 32 / 8%);
    position: absolute;
    left: 8px;
    bottom: -5px;
  }

  .date__two-days {
    display: flex;
    align-items: center;
    font-size: 14px;
    gap: 4px;
    font-weight: ${variables.bold700};
  }

  .date__day {
    font-weight: ${variables.bold700};
    font-size: 12px;
  }

  .date__month {
    font-size: 12px;
    text-transform: uppercase;
    font-weight: 400;
  }

  .date__anytime {
    line-height: 18px;
    font-weight: ${variables.bold700};
  }

  .event-card__title {
    font-family: Poppins;
    font-size: 16px;
    color: ${variables.black};
    font-weight: ${variables.bold700};
    line-height: 26px;
    text-align: left;
    margin-top: 12px;
    padding-left: 8px;
  }

  .event-card__info {
    color: ${variables.desaturatedBlue};
    font-family: Poppins;
    font-size: 12px;
    line-height: 18px;
    text-align: left;
    padding-left: 8px;
  }

  .event__format:before,
  .event__format:after {
    content: '';
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: ${variables.desaturatedBlue};
    display: inline-block;
    margin: 2px 8px;
  }

  @media ${variables.lg} {
    .event-panel__background {
      display: inline-block;
    }

    .event-description {
      max-width: 65%;
    }

    .event-panel__info {
      max-width: 65%;
    }
  }
`

export default eventCardStyle
