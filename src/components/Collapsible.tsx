import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import ChevronDownIcon from './icons/ChevronDownIcon';

const Collapsible = (props: {
  title: string;
  expanded?: boolean;
  onChange?: (event: React.SyntheticEvent, expanded: boolean) => void;
  children: JSX.Element;
}): React.ReactElement => {
  return (
    <Accordion
      expanded={props.expanded}
      onChange={props.onChange}
      sx={{
        margin: 0,
      }}
      TransitionProps={{ unmountOnExit: true }}
    >
      <AccordionSummary
        expandIcon={<ChevronDownIcon />}
        id='panel1a-header'
      >
        {props.title}
      </AccordionSummary>
      <AccordionDetails>{props.children}</AccordionDetails>
    </Accordion>
  );
};

export default Collapsible;
