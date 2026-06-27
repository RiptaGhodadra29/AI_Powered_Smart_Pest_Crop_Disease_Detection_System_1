import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { uploadImage } from "../../services/imageService";
import { routerPredict } from "../../services/routerService";

import { Page, PageHeader } from "../../components/ui/Page";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Icon from "../../components/ui/Icon";
import Badge from "../../components/ui/Badge";
import { cn } from "../../components/ui/cn";
import { useLanguage } from "../../context/LanguageContext";

const Upload = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const imageTypes = [
    {
      value: "disease",
      label: t.disease,
      description: t.upload_disease_desc,
      icon: "leaf",
    },
    {
      value: "pest",
      label: t.pest,
      description: t.upload_pest_desc,
      icon: "bug",
    },
  ];

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageType, setImageType] = useState("disease");

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    setSelectedFile(file);

    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error(t.upload_selectError);
      return;
    }

    try {
      setLoading(true);

      // Upload Image
      const uploadResponse = await uploadImage(selectedFile);

      setUploadResult(uploadResponse);

      // AI Router Prediction
      const result = await routerPredict(uploadResponse.image_id, imageType);

      toast.success(t.upload_success);

      navigate("/prediction-result", {
        state: {
          ...result,
          imagePreview: preview,
        },
      });
    } catch (error) {
      console.error(error);

      toast.error(t.upload_error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page width="lg">
      <PageHeader
        eyebrow={t.upload_eyebrow}
        title={t.upload_title}
        description={t.upload_description}
      />

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Uploader + controls */}
        <div className="space-y-6 lg:col-span-3">
          <Card>
            <CardHeader
              icon={<Icon name="image" className="h-5 w-5" />}
              title={t.upload_step1_title}
              description={t.upload_step1_desc}
            />
            <CardBody>
              <label
                htmlFor="crop-image"
                className={cn(
                  "group flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50/60 px-6 py-10 text-center transition-all duration-200",
                  "hover:border-brand-400 hover:bg-brand-50/50 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/30"
                )}
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-brand-600 shadow-soft transition-transform duration-200 group-hover:scale-105">
                  <Icon name="upload" className="h-6 w-6" />
                </span>
                <span className="text-sm font-semibold text-neutral-800">
                  {t.upload_clickToUpload}
                </span>
                <span className="text-xs text-neutral-500">
                  {selectedFile ? selectedFile.name : t.upload_dragHere}
                </span>
                <input
                  id="crop-image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </label>
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              icon={<Icon name="layers" className="h-5 w-5" />}
              title={t.upload_step2_title}
              description={t.upload_step2_desc}
            />
            <CardBody>
              <fieldset>
                <legend className="sr-only">{t.upload_step2_title}</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {imageTypes.map((type) => {
                    const active = imageType === type.value;
                    return (
                      <label
                        key={type.value}
                        className={cn(
                          "relative flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-all duration-200",
                          active
                            ? "border-brand-500 bg-brand-50 ring-1 ring-brand-500"
                            : "border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50"
                        )}
                      >
                        <input
                          type="radio"
                          name="imageType"
                          value={type.value}
                          checked={active}
                          onChange={(e) => setImageType(e.target.value)}
                          className="sr-only"
                        />
                        <span
                          className={cn(
                            "flex h-9 w-9 items-center justify-center rounded-lg",
                            active
                              ? "bg-brand-600 text-white"
                              : "bg-neutral-100 text-neutral-500"
                          )}
                        >
                          <Icon name={type.icon} className="h-5 w-5" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold text-neutral-900">
                            {type.label}
                          </span>
                          <span className="block text-xs text-neutral-500">
                            {type.description}
                          </span>
                        </span>
                        {active && (
                          <Icon
                            name="check"
                            className="absolute right-3 top-3 h-4 w-4 text-brand-600"
                          />
                        )}
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <Button
                onClick={handleUpload}
                disabled={loading || !selectedFile}
                loading={loading}
                size="lg"
                className="mt-6 w-full"
              >
                {loading ? t.upload_processing : t.upload_submit}
                {!loading && <Icon name="arrowRight" className="h-4 w-4" />}
              </Button>
            </CardBody>
          </Card>
        </div>

        {/* Preview / result */}
        <div className="lg:col-span-2">
          <Card className="lg:sticky lg:top-24">
            <CardHeader
              icon={<Icon name="eye" className="h-5 w-5" />}
              title={t.upload_preview}
            />
            <CardBody className="space-y-4">
              {preview ? (
                <img
                  key={preview}
                  src={preview}
                  alt="Selected crop preview"
                  className="animate-scale-in aspect-square w-full rounded-xl border border-neutral-200 object-cover"
                />
              ) : (
                <div className="flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-200 bg-neutral-50 text-neutral-400">
                  <Icon name="image" className="h-8 w-8" />
                  <span className="text-xs">{t.upload_noImage}</span>
                </div>
              )}

              {uploadResult && (
                <div className="animate-rise space-y-2 rounded-xl bg-neutral-50 p-4">
                  <div className="flex items-center gap-2">
                    <Badge tone="success" icon={<Icon name="check" className="h-3.5 w-3.5" />}>
                      {t.upload_uploaded}
                    </Badge>
                  </div>
                  <dl className="space-y-1.5 text-sm">
                    <div className="flex justify-between gap-3">
                      <dt className="text-neutral-500">{t.upload_imageId}</dt>
                      <dd className="truncate font-medium text-neutral-900">
                        {uploadResult.image_id}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-neutral-500">{t.upload_imageName}</dt>
                      <dd className="truncate font-medium text-neutral-900">
                        {uploadResult.image_name}
                      </dd>
                    </div>
                  </dl>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </Page>
  );
};

export default Upload;
