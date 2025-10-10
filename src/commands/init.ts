import inquirer from "inquirer";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import type { Command } from "commander";

export function init(ui: Command) {
  ui.command("init")
    .description("Initialize UI config")
    .action(async () => {
      const answers = await inquirer.prompt([
        {
          name: "path",
          type: "input",
          message: "Components path:",
          default: "src/components",
        },
      ]);

      const configPath = path.resolve(process.cwd(), "ui.config.json");
      fs.writeFileSync(configPath, JSON.stringify(answers, null, 2));
      console.log(chalk.blue(`Created ui.config.json at ${configPath}`));
    });
}
