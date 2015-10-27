#!/usr/bin/env node
require('babel/register');
import cli from 'cli';
import { newUser } from '../services/user.server.service';
cli.parse({
    username:   ['u', 'Username', 'string'],
    email:  ['e', 'Email', 'email'],
    password: ['p', 'Password', 'string'],
    roles: ['r', 'Roles', 'string']
});

cli.main(function(args, options) {
    newUser(options);
});