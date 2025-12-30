import { S3, CreateBucketCommandInput } from "@aws-sdk/client-s3";
import { logger } from "./logger";

/**
 * Ensures that the specified S3 bucket exists, creating it if necessary
 */
export async function ensureBucketExists(
  bucketName: string,
  region: string,
): Promise<boolean> {
  const s3 = new S3({ region });

  try {
    logger.debug(`Checking if bucket exists: ${bucketName}`);
    await s3.headBucket({ Bucket: bucketName });
    logger.debug(`Bucket ${bucketName} already exists`);
    return true;
  } catch (error: unknown) {
    const errorName = error instanceof Error ? (error as { name?: string }).name : undefined;
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorName !== "NotFound" && errorName !== "NoSuchBucket") {
      logger.error(`Error checking bucket: ${errorMessage}`);
      throw error;
    }

    logger.info(`Creating bucket: ${bucketName}`);

    try {
      // Create bucket with or without location constraint based on region
      const createBucketParams: CreateBucketCommandInput = { Bucket: bucketName };

      // Only specify LocationConstraint if not in us-east-1 (which is the default)
      if (region !== "us-east-1") {
        createBucketParams.CreateBucketConfiguration = {
          LocationConstraint: region,
        };
      }

      await s3.createBucket(createBucketParams);

      // Wait for the bucket to become available
      for (let i = 0; i < 5; i++) {
        try {
          await s3.headBucket({ Bucket: bucketName });
          logger.success(
            `Bucket ${bucketName} successfully created and is available`,
          );
          return true;
        } catch (err) {
          if (i === 4) {
            logger.error(
              `Bucket ${bucketName} was created but is not yet available after multiple retries`,
            );
            throw err;
          }
          logger.info(
            `Waiting for bucket ${bucketName} to become available...`,
          );
          await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds
        }
      }

      return true;
    } catch (createError: unknown) {
      logger.error(
        `Failed to create bucket ${bucketName}: ${createError.message}`,
      );
      throw createError;
    }
  }
}
