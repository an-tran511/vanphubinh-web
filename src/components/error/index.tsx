import { Title, Text, Button, Container, Group, Center } from '@mantine/core';
import classes from './Error.module.css';

export function Error() {
  return (
    <Center className={classes.root}>
      <Container>
        <div className={classes.label}>500</div>
      </Container>
    </Center>
  );
}
