#!/usr/bin/env ts-node
/**
 * Remove CloudFormation stacks for CloudWatch Live
 *
 * Usage:
 *   yarn remove-stacks --stage dev              # Remove all stacks for dev stage
 *   yarn remove-stacks --stage dev --stack S3   # Remove specific stack
 *   yarn remove-stacks --help                   # Show help
 */

import { program } from "commander";
import { DeploymentManager } from "./deployment-manager";
import { StackType, DeploymentOptions } from "./types";
import { logger, setLogFile } from "./utils/logger";
import * as path from "path";
import inquirer from "inquirer";

async function runInteractiveRemoval(): Promise<{ stage: string; stackType?: StackType; removeAll: boolean }> {
  logger.info("🗑️  CloudWatch Live - Stack Removal");
  logger.info("===================================\n");

  // Step 1: Select stage
  const { stage } = await inquirer.prompt<{ stage: string }>([
    {
      type: "list",
      name: "stage",
      message: "Select stage to remove stacks from:",
      choices: ["dev", "prod"],
      default: "dev",
    },
  ]);

  // Step 2: Select removal scope
  const { removalScope } = await inquirer.prompt<{ removalScope: "all" | "single" }>([
    {
      type: "list",
      name: "removalScope",
      message: "What would you like to remove?",
      choices: [
        { name: "Remove ALL stacks (complete teardown)", value: "all" },
        { name: "Remove a specific stack", value: "single" },
      ],
      default: "all",
    },
  ]);

  if (removalScope === "all") {
    return { stage, removeAll: true };
  } else {
    // Select specific stack
    const { stackType } = await inquirer.prompt<{ stackType: StackType }>([
      {
        type: "list",
        name: "stackType",
        message: "Select stack to remove:",
        choices: Object.values(StackType).map(type => ({
          name: type,
          value: type,
        })),
      },
    ]);

    return { stage, stackType, removeAll: false };
  }
}

async function removeStacks(options: { stage: string; stackType?: string; removeAll?: boolean }): Promise<void> {
  const { stage, stackType, removeAll } = options;

  // Set up logging
  const timestamp = new Date().toISOString().replace(/:/g, "-").split(".")[0];
  const logDir = path.join(__dirname, "../.cache/deploy/logs");
  const logFile = path.join(logDir, `remove-stacks-${stage}-${timestamp}.log`);
  setLogFile(logFile);
  logger.info(`📝 Logging to: ${logFile}`);

  const deploymentManager = new DeploymentManager();
  await deploymentManager.initializeAws();

  const deploymentOptions: DeploymentOptions = {
    stage,
    region: "ap-southeast-2",
  };

  try {
    if (removeAll) {
      logger.info(`\n🗑️  Removing ALL stacks for stage: ${stage}`);
      logger.warning("⚠️  This will remove all infrastructure and data!");
      await deploymentManager.removeAllStacks(deploymentOptions);
    } else if (stackType) {
      logger.info(`\n🗑️  Removing ${stackType} stack for stage: ${stage}`);
      const stackTypeEnum = stackType as StackType;
      await deploymentManager.removeStack(stackTypeEnum, deploymentOptions);
    } else {
      logger.error("Error: Must specify either --stack or --all");
      process.exit(1);
    }

    logger.success("\n✅ Stack removal completed successfully!");
  } catch (error: unknown) {
    logger.error(`\n❌ Stack removal failed: ${error.message}`);
    process.exit(1);
  }
}

// Main entry point
if (require.main === module) {
  program
    .name("remove-stacks")
    .description("Remove CloudFormation stacks for CloudWatch Live")
    .option("--stage <stage>", "Deployment stage (dev, prod)")
    .option("--stack <stack>", "Specific stack type to remove (e.g., Shared, CWL)")
    .option("--all", "Remove all stacks (use with caution!)")
    .option("--interactive", "Run interactive removal wizard")
    .parse(process.argv);

  const opts = program.opts();

  // Run interactive mode if --interactive flag is set OR if no arguments provided
  const shouldRunInteractive = opts.interactive || process.argv.length === 2;

  if (shouldRunInteractive) {
    (async () => {
      try {
        const interactiveOpts = await runInteractiveRemoval();
        await removeStacks({
          stage: interactiveOpts.stage,
          stackType: interactiveOpts.stackType,
          removeAll: interactiveOpts.removeAll,
        });
      } catch (error: unknown) {
        logger.error(`Stack removal failed: ${error.message}`);
        process.exit(1);
      }
    })();
  } else {
    // CLI mode with flags
    if (!opts.stage) {
      logger.error("Error: --stage is required");
      logger.info("Usage: yarn remove-stacks --stage dev [--stack Shared | --all]");
      process.exit(1);
    }

    (async () => {
      try {
        await removeStacks({
          stage: opts.stage,
          stackType: opts.stack,
          removeAll: opts.all,
        });
      } catch (error: unknown) {
        logger.error(`Stack removal failed: ${error.message}`);
        process.exit(1);
      }
    })();
  }
}
