import { useEffect, useState } from 'react';
import { Button, FloatingLabel, Form, Modal } from 'react-bootstrap';

import getAllRequests from '../../services/maintenance/getAllRequests';
import createRequest from '../../services/maintenance/createRequest';