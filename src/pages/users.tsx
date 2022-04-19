import { Field, Form, Formik } from "formik";
import { useState } from "react";
import prisma from "../lib/prisma"
import { User, UserCreateData, UserSchema, UserCreateSchema, UserPatchSchema, UserPatchData } from "../models/user";

interface UsersProps {
  users: User[]
}

export default function Home({ users: initialUsers }: UsersProps) {
  const [users, setUsers] = useState(initialUsers);
  const [errors, setErrors] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const createUser = async (user: UserCreateData) => {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    if(!response.ok) {
      setErrors(response.statusText);
      return;
    }
    const newUser = UserSchema.cast(await response.json());
    setErrors(null);
    setUsers(prev => ([...prev, newUser]));
  }

  const editUser = async (user: UserPatchData) => {
    const response = await fetch(`/api/users/${editingUser!.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    if(!response.ok) {
      setErrors(response.statusText);
      return;
    }
    const patched = UserSchema.cast(await response.json());
    setErrors(null);
    setEditingUser(null);
    const editedUserIdx = users.findIndex(user => user.id === patched.id);
    setUsers(prev => ([
      ...prev.slice(0, editedUserIdx),
      patched,
      ...prev.slice(editedUserIdx + 1),
    ]));
  }

  const deleteUser = async (user: User) => {
    const response = await fetch(`/api/users/${user.id}`, {
      method: 'DELETE',
    });
    if(!response.ok) {
      setErrors(response.statusText);
      return;
    }
    const deletedUser = UserSchema.cast(await response.json());
    setErrors(null);
    setUsers(prev => (prev.filter(user => user.id !== deletedUser.id)));
  }

  return (
    <>
      <h2>Users</h2>

      <section>
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>First name</th>
              <th>Last name</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            { users.map(user => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.role}</td>
                <td>
                  <button onClick={() => setEditingUser(user)}>Edit</button>
                  <button onClick={() => deleteUser(user)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      
      { editingUser &&
        <section>
          <Formik
            initialValues={{
              firstName: editingUser.firstName,
              lastName: editingUser.lastName,
              role: null,
            }}
            onSubmit={async (values) => {
              editUser(values);
            }}
            validationSchema={UserPatchSchema}
          >
            {({errors: formErrors}) => (
              <Form>
                <h3>Edit user</h3>

                <div className="form-field">
                  <label htmlFor="firstName">First Name: </label>
                  <Field id="firstName" name="firstName" placeholder="John" />
                </div>

                <div className="form-field">
                  <label htmlFor="lastName">Last Name: </label>
                  <Field id="lastName" name="lastName" placeholder="Wick" />
                </div>

                { Object.keys(formErrors).length > 0 &&
                  <div className="form-field">
                    <pre style={{color: "red"}}>
                      {JSON.stringify(formErrors, null, 2)}
                    </pre>
                  </div>
                }

                <button type="submit">Edit</button>
                <button onClick={() => setEditingUser(null)}>Cancel</button>
              </Form>
            )}
          </Formik>
        </section>
      }

      <section>
        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            email: '',
            password: '',
          }}
          onSubmit={async (values) => {
            createUser(values);
          }}
          validationSchema={UserCreateSchema}
        >
          {({errors: formErrors}) => (
            <Form>
              <h3>Create user</h3>

              <div className="form-field">
                <label htmlFor="firstName">First Name: </label>
                <Field id="firstName" name="firstName" placeholder="John" />
              </div>

              <div className="form-field">
                <label htmlFor="lastName">Last Name: </label>
                <Field id="lastName" name="lastName" placeholder="Wick" />
              </div>

              <div className="form-field">
                <label htmlFor="email">Email: </label>
                <Field
                  id="email"
                  name="email"
                  placeholder="johnwick@mail.com"
                  type="email"
                />
              </div>
              <div className="form-field">
                <label htmlFor="password">Password: </label>
                <Field
                  id="password"
                  name="password"
                  type="password"
                />
              </div>

              { Object.keys(formErrors).length > 0 &&
                <div className="form-field">
                  <pre style={{color: "red"}}>
                    {JSON.stringify(formErrors, null, 2)}
                  </pre>
                </div>
              }

              <button type="submit">Create</button>
            </Form>
          )}
        </Formik>
      </section>

      <section>
        { errors &&
          <div className="form-field">
            <pre style={{color: "red"}}>
              {JSON.stringify(errors, null, 2)}
            </pre>
          </div>
        }
      </section>
    </>
  )
}

export async function getServerSideProps({ query, res, req }) {
  const users = (await prisma.user.findMany({})).map(user =>
    UserSchema.cast(user, {stripUnknown: true})
  );
  
  return {
    props: {
      users,
    }
  }
}
