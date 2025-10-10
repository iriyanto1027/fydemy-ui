import { Command } from "commander";
import fs from "fs";
import path, { dirname, resolve } from "path";
import chalk from "chalk";
import { fileURLToPath } from "url";

export function add(program: Command) {
  program
    .command("add <name>")
    .description("Add a new component to your path")
    .action((name: string) => {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);

      const configPath = resolve(process.cwd(), "ui.config.json");
      let targetPath = "src/components"; // path fallback

      if (fs.existsSync(configPath)) {
        try {
          const configRaw = fs.readFileSync(configPath, "utf-8");
          const config = JSON.parse(configRaw);
          if (config.path || config.componentsPath) {
            targetPath = config.path || config.componentsPath;
          }
        } catch {
          console.log(
            chalk.yellow("Failed to read ui.config.json, using default path")
          );
        }
      }

      const dir = resolve(process.cwd(), targetPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      const templateFile = resolve(__dirname, "../../templates", `${name}.txt`);
      if (!fs.existsSync(templateFile)) {
        console.log(chalk.red(`Component not found`));
        return;
      }

      const content = fs.readFileSync(templateFile, "utf-8");

      const filePath = path.join(dir, `${name}.tsx`);
      fs.writeFileSync(filePath, content);

      console.log(chalk.green(`Created component ${filePath}`));
    });
}
