import { Command } from 'commander';

const program = new Command();

program
  .version('1.0.0')
  .description('An example CLI for TypeScript')
  .option('-n, --name <name>', 'specify your name', 'World')
  .action((options) => {
    console.log(`Hello, ${options.name}!`);
  });

program.parse(process.argv);