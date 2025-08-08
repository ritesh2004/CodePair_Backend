const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { v4 } = require('uuid');

const languageConfig = {
    javascript: {
        extension: 'js',
        dockerFile: 'js.dockerfile',
        filename: 'main.js',
    },
    python: {
        extension: 'py',
        dockerFile: 'python.dockerfile',
        filename: 'main.py',
    },
    c: {
        extension: 'c',
        dockerFile: 'c.dockerfile',
        filename: 'main.c',
    },
    cpp: {
        extension: 'cpp',
        dockerFile: 'cpp.dockerfile',
        filename: 'main.cpp',
    },
    java: {
        extension: 'java',
        dockerFile: 'java.dockerfile',
        filename: 'Main.java',
    }
};

exports.compileCode = async (req, res) => {
    const { code, language } = req.body;

    if (!code || !language) {
        return res.status(400).json({ error: 'Code and language are required' });
    }

    const langConfig = languageConfig[language];
    if (!langConfig) {
        return res.status(400).json({ error: 'Unsupported language' });
    }

    const jobId = v4();
    const jobDir = path.join(__dirname,"..", 'temp', jobId);
    const codeDir = path.join(jobDir, 'code');
    try {
        // Create both job directory and code subdirectory
        fs.mkdirSync(codeDir, { recursive: true });

        const filePath = path.join(codeDir, langConfig.filename);
        fs.writeFileSync(filePath, code);

        const dockerFilePath = path.join(__dirname, "..", 'runtimes', langConfig.dockerFile);

        fs.copyFileSync(dockerFilePath, path.join(jobDir, 'Dockerfile'));
    
        const imageTag = `job-run-${jobId}`;
    
        const dockerCommand = `docker build -t ${imageTag} ${jobDir}`;
        console.log(`Executing Docker build command: ${dockerCommand}`);
        // Build Docker image and capture build output
        const buildResult = await execPromise(dockerCommand);
        console.log(`Docker image ${imageTag} built successfully`);
        
        // If build had errors but succeeded, include them
        let buildErrors = buildResult.stderr;
    
        const runCommand = `docker run --rm --memory=100m --cpus="0.5" ${imageTag}`;
    
        const { stdout, stderr } = await execPromise(runCommand, { timeout : 5000});

        res.json({
            jobId,
            output: stdout,
            error: stderr
        });
    } catch (error) {
        if (error.killed) {
            return res.status(500).json({ error: 'Execution timed out' });
        }
        else {
            console.log(error)
            // Provide more detailed error information
            let errorMessage = 'An error occurred during compilation or execution';
            let errorDetails = error.stderr || error.message;
            
            // Check if it's a Docker build error
            if (errorDetails && errorDetails.includes('docker build')) {
                errorMessage = 'Compilation failed';
            }
            
            return res.status(500).json({ 
                error: errorMessage, 
                details: errorDetails,
                stdout: error.stdout || null
            });
        }
    }
    finally {
        await execPromise(`docker rmi job-run-${jobId}`, { timeout: 5000 }).catch(() => {});
        fs.rmSync(jobDir, { recursive: true, force: true });
    }
}

const execPromise = (command, options={}) => {
    return new Promise((resolve, reject) => {
        exec(command, options, (error, stdout, stderr) => {
            if (error) {
                return reject(Object.assign(error, { stdout, stderr }));
            } else {
                resolve({ stdout, stderr });
            }
        });
    });
}