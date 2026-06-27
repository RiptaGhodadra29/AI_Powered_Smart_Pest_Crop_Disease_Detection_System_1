import { useState } from "react";
import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Icon from "../../components/ui/Icon";
import { Card } from "../../components/ui/Card";
import { useLanguage } from "../../context/LanguageContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = await loginUser(formData);

      login(data.access_token);

      toast.success(t.login_success);

      navigate("/dashboard");
    } catch (error) {
      toast.error(t.login_error);

      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-rise">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
            <Icon name="leaf" className="h-6 w-6" />
          </span>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-neutral-900">
            {t.login_title}
          </h1>
          <p className="mt-1.5 text-sm text-neutral-500">
            {t.login_subtitle}
          </p>
        </div>

        <Card className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <Input
              label={t.login_email}
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@example.com"
              icon={<Icon name="mail" className="h-4 w-4" />}
              value={formData.email}
              onChange={handleChange}
            />

            <Input
              label={t.login_password}
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="••••••••"
              icon={<Icon name="lock" className="h-4 w-4" />}
              value={formData.password}
              onChange={handleChange}
            />

            <Button
              type="submit"
              size="lg"
              loading={submitting}
              className="w-full"
            >
              {submitting ? t.login_submitting : t.login_submit}
            </Button>
          </form>
        </Card>

        <p className="mt-6 text-center text-sm text-neutral-500">
          {t.login_noAccount}{" "}
          <Link
            to="/register"
            className="font-semibold text-brand-700 underline-offset-4 hover:underline"
          >
            {t.login_createOne}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
