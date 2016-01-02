#!/usr/bin/env node
require('babel/register');
import cli from 'cli';
import { newUser } from '../services/user.service';
cli.parse({
    numusers:   ['n', '# of users to generate', 'integer']
});

cli.main(function(args, options) {
    console.log(args,options)
});