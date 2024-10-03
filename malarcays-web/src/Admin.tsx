import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { AccountData } from './services/api';

export function getUserByAccount(accountNumber: string) {
  const usersURL = `https://api.malarcays.uk/search/account?account=${accountNumber}`;
  return fetch(usersURL, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .catch((error) => {
      console.error('Error fetching users:', error);
    });
}
