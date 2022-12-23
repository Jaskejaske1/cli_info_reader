const fs = require('fs');
const path = require('path');
const yargs = require('yargs');
const toml = require('@ltd/j-toml');
const inquirer = require('inquirer');

// Define the expected arguments and options using yargs
const argv = yargs
	.option('subject', {
		alias: 's',
		describe: 'The subject to search',
		type: 'string',
		demandOption: true,
	})
	.option('chapter', {
		alias: 'c',
		describe: 'The chapter to search',
		type: 'string',
		demandOption: true,
	})
	.option('definition', {
		alias: 'd',
		describe: 'The definition or data to search for',
		type: 'string',
		demandOption: true,
	})
	.help()
	.argv;

// Extract the values for the subject, chapter, and definition from the parsed arguments
const subject = argv.subject;
const chapter = argv.chapter;
const definition = argv.definition;

// Build the path to the .toml file
const filePath = path.join(__dirname, 'subjects', subject, chapter, 'definitions.toml');

// Read the contents of the .toml file
fs.readFile(filePath, 'utf8', (err, data) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
  
	// Parse the .toml file contents into a JavaScript object using the toml library
	const fileData = toml.parse(data);
  
	// Iterate over each definition and search for the definition or data that the user is looking for
	const matchingDefinitions = [];
	Object.keys(fileData.definitions).forEach((key) => {
		if (fileData.definitions[key].includes(definition)) {
			matchingDefinitions.push({
				name: key,
				value: fileData.definitions[key],
			});
		}
	});
  
	// If there are no matching definitions, print an error message and exit
	if (matchingDefinitions.length === 0) {
		console.log(`Definition "${definition}" not found in subject "${subject}" chapter "${chapter}"`);
		process.exit(1);
	}
  
	// Prompt the user to select a definition from the list of matching definitions
	inquirer
		.prompt([
			{
				type: 'list',
				name: 'selectedDefinition',
				message: 'Select a definition:',
				choices: matchingDefinitions,
			},
		])
		.then((answers) => {
			console.log(answers.selectedDefinition);
		});
});